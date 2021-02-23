'''
https://f1-2020-telemetry.readthedocs.io/en/latest/
'''
from f1_2020_telemetry import *
from f1_2020_telemetry.packets import *
import time as t
from datetime import datetime as dt
import socket, f1_2020_telemetry, json, ctypes

import numpy as np

telemetry = {}

#official data by codemasters
TeamIDs = [
    "Mercedes",
    "Ferrari",
    "Red Bull Racing",
    "Williams",
    "Racing Point",
    "Renault",
    "AlphaTauri",
    "Haas",
    "McLaren",
    "Alfa Romeo",
    "McLaren 1988",
    "McLaren 1991",
    "Williams 1992",
    "Ferrari 1995",
    "Williams 1996",
    "McLaren 1998",
    "Ferrari 2002",
    "Ferrari 2004",
    "Renault 2006",
    "Ferrari 2007",
    "McLaren 2008",
    "Red Bull 2010",
    "McLaren 1990",
    "Williams 2003",
    "Brawn 2009",
    "F1 Generic car",
    "ART Grand Prix",
    "Campos Racing",
    "Carlin",
    "Sauber Junior Team by Charouz",
    "DAMS",
    "UNI-Virtuosi",
    "MP Motorsport",
    "PREMA Racing",
    "Trident",
    "BWT Arden",
    "Benetton 1994",
    "Benetton 1995",
    "Ferrari 2000",
    "Jordan 1991",
    "Ferrari 1990",
    "McLaren 2010",
    "Ferrari 2010",
    "My Team",
    ]
DriverIDs = [
    "Carlos Sainz",
    "Daniil Kvyat",
    "Daniel Ricciardo",
    "Kimi Räikkönen",
    "Lewis Hamilton",
    "Max Verstappen",
    "Nico Hulkenberg",
    "Kevin Magnussen",
    "Romain Grosjean",
    "Sebastian Vettel",
    "Sergio Perez",
    "Valtteri Bottas",
    "Esteban Ocon",
    "Lance Stroll",
    "Arron Barnes",
    "Martin Giles",
    "Alex Murray",
    "Lucas Roth",
    "Igor Correia",
    "Sophie Levasseur",
    "Jonas Schiffer",
    "Alain Forest",
    "Jay Letourneau",
    "Esto Saari",
    "Yasar Atiyeh",
    "Callisto Calabresi",
    "Naota Izum",
    "Howard Clarke",
    "Wilhelm Kaufmann",
    "Marie Laursen",

    "Flavio Nieves",
    "Peter Belousov",
    "Klimek Michalski",
    "Santiago Moreno",
    "Benjamin Coppens",
    "Noah Visser",
    "Gert Waldmuller",
    "Julian Quesada",
    "Daniel Jones",
    "Artem Markelov",
    "Tadasuke Makino",
    "Sean Gelael",
    "Nyck De Vries",
    "Jack Aitken",
    "George Russell",
    "Maximilian Günther",
    "Nirei Fukuzumi",
    "Luca Ghiotto",
    "Lando Norris",
    "Sérgio Sette Câmara",
    "Louis Delétraz",
    "Antonio Fuoco",
    "Charles Leclerc",
    "Pierre Gasly",
    "Alexander Albon",
    "Nicholas Latifi",
    "Dorian Boccolacci",
    "Niko Kari",
    "Roberto Merhi",
    "Arjun Maini"

    "Alessio Lorandi",
    "Ruben Meijer",
    "Rashid Nair",
    "Jack Tremblay",
    "Antonio Giovinazzi",
    "Robert Kubica",
    "Nobuharu Matsushita",
    "Nikita Mazepin",
    "Guanyu Zhou",
    "Mick Schumacher",
    "Callum Ilott",
    "Juan Manuel Correa",
    "Jordan King",
    "Mahaveer Raghunathan",
    "Tatiana Calderón",
    "Anthoine Hubert",
    "Giuliano Alesi",
    "Ralph Boschung",
    ]
TrackIDs = [
    "Melbourne",
    "Paul Ricard",
    "Shanghai",
    "Sakhir (Bahrain)",
    "Catalunya",
    "Monaco",
    "Montreal",
    "Silverstone",
    "Hungaroring",
    "Spa",
    "Monza",
    "Singapore",
    "Suzuka",
    "Abu Dhabi"
    "Texas",
    "Brazil",
    "Austria",
    "Sochi",
    "Mexico",
    "Baku (Azerbaijan)",
    "Sakhir Short",
    "Silverstone Short",
    "Texas Short",
    "Suzuka Short",
    "Hanoi",
    "Zandvoort"
    ]
SurfaceTypes = [
	"Tarmac",
    "Rumble strip",
    "Concrete",
    "Rock",
    "Gravel",
    "Mud",
    "Sand",
    "Grass",
    "Water",
    "Cobblestone",
    "Metal",
    "Ridged"
    ]


def main():
    speed, time, rpm, throttle, brake, steer, gear = [], [], [], [], [], [], []

    host = ""
    port = 20777
    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    udp_socket.bind((host, port))

    global telemetry
    tyres = ["RL", "RR", "FL", "FR"]
    carindex = 0
    
    #Packet extraction
    while True:
        udp_packet = udp_socket.recv(2048)
        packet = unpack_udp_packet(udp_packet)

        carindex = packet.header.playerCarIndex

        #header info
        telemetry.update({
            "Packet_Format" : packet.header.packetFormat,
            "Game_Major_Version" : packet.header.gameMajorVersion,
            "Game_Minor_Version" : packet.header.gameMinorVersion,
            "Packet_Version" : packet.header.packetVersion,
            "Packet_ID" : packet.header.packetId,
            "Session_UID" : packet.header.sessionUID,
            "Session_Time" : packet.header.sessionTime,
            "Frame_Identifier" : packet.header.frameIdentifier,
            "Player_Car_Index" : packet.header.playerCarIndex,
            })
        
        if isinstance(packet, PacketSessionData_V1):
            telemetry.update({                
                "Weather_ID" : packet.weather,
                "Weather" : ["clear", "light cloud", "overcast", "light rain", "light rain", "storm"][packet.weather],
                "Track_Temperature" : packet.trackTemperature,
                "Air_Temperature" : packet.airTemperature,
                "Total_Laps" : packet.totalLaps,
                "Track_Lenght" : packet.trackLength,
                "Session_Type_ID" : packet.sessionType,
                "Session_Type" : ["unknown", "P1", "P2", "P3", "Short P", "Q1", "Q2", "Q3", "Short Q", "OSQ", "R", "R2", "Time Trial"][packet.sessionType],
                "Track" : TrackIDs[packet.trackId],
                "Track_ID" : packet.trackId,
                "Class_ID" : packet.formula,
                "Class" : ["F1 Modern", "F1 Classic", "F2", "F1 Generic"][packet.formula],

                "Session_Time_Left" : packet.sessionTimeLeft,
                "Session_Duration" : packet.sessionDuration,
                "Pit_Speed_Limit" : packet.pitSpeedLimit,
                "Game_Paused" : packet.gamePaused,
                "Is_Spectating" : packet.isSpectating,
                "Spectator_Car_Index" : packet.spectatorCarIndex,
                "Sli_Pro_Native_Support" : packet.sliProNativeSupport,
                "Num_Marshal_Zones" : packet.numMarshalZones,
                # cannot convert to JSON
                # "Marshal_Zones" : packet.marshalZones,
                "Marshal_Zone_Start" : packet.marshalZones.__getitem__(carindex).zoneStart,
                "Marshal_Zone_Flag" : packet.marshalZones.__getitem__(carindex).zoneFlag,
                "Safety_Car_Status_ID" : packet.safetyCarStatus,
                "Safety_Car_Status" : ["No safety car", "full safety car", "virtual safety car"][packet.safetyCarStatus],
                "Network_Game" : packet.networkGame,
                "Num_Weather_Forecast_Samples" : packet.numWeatherForecastSamples,
                # cannot convert to JSON
                # "Weather_Forecast_Samples" : packet.weatherForecastSamples,
                })



        if isinstance(packet, PacketLapData_V1):       
            telemetry.update({
                "Last_Lap_Time" : packet.lapData.__getitem__(carindex).lastLapTime,
                "Current_Lap_Time": packet.lapData.__getitem__(carindex).currentLapTime,
                "Sector_1_Time" : packet.lapData.__getitem__(carindex).sector1TimeInMS,
                "Sector_2_Time" : packet.lapData.__getitem__(carindex).sector1TimeInMS,
                "Best_Lap_Time" : packet.lapData.__getitem__(carindex).bestLapTime,
                "Best_Lap_Num" : packet.lapData.__getitem__(carindex).bestLapNum,

                "Best_Lap_Sector1_Time" : packet.lapData.__getitem__(carindex).bestLapSector1TimeInMS,
                "Best_Lap_Sector2_Time" : packet.lapData.__getitem__(carindex).bestLapSector2TimeInMS,
                "Best_Lap_Sector3_Time" : packet.lapData.__getitem__(carindex).bestLapSector3TimeInMS,

                "Best_Overall_Sector1_Time" : packet.lapData.__getitem__(carindex).bestOverallSector1TimeInMS,
                "Best_Overall_Sector1_Lap_Num" : packet.lapData.__getitem__(carindex).bestOverallSector1LapNum,
                "Best_Overall_Sector2_Time" : packet.lapData.__getitem__(carindex).bestOverallSector2TimeInMS,
                "Best_Overall_Sector2_Lap_Num" : packet.lapData.__getitem__(carindex).bestOverallSector2LapNum,
                "Best_Overall_Sector3_Time" : packet.lapData.__getitem__(carindex).bestOverallSector3TimeInMS,
                "Best_Overall_Sector3_Lap_Num" : packet.lapData.__getitem__(carindex).bestOverallSector3LapNum,

                "Lap_Distance" : packet.lapData.__getitem__(carindex).lapDistance,
                "Total_Distance" : packet.lapData.__getitem__(carindex).totalDistance,
                "Safety_Car_Delta" : packet.lapData.__getitem__(carindex).safetyCarDelta,
                "Car_Position" : packet.lapData.__getitem__(carindex).carPosition,
                "Current_Lap_Num" : packet.lapData.__getitem__(carindex).currentLapNum,
                "Pit_Status_ID" : packet.lapData.__getitem__(carindex).pitStatus,
                "Pit_Status" : ["None", "Pitting", "In Pit Area"][packet.lapData.__getitem__(carindex).pitStatus],
                "Sector_ID" : packet.lapData.__getitem__(carindex).sector,
                "Sector" : ["Sector1", "Sector2", "Sector3"][packet.lapData.__getitem__(carindex).sector],
                "Current_Lap_Invalid" : packet.lapData.__getitem__(carindex).currentLapInvalid,
                "Penalties" : packet.lapData.__getitem__(carindex).penalties,
                "Grid_Position" : packet.lapData.__getitem__(carindex).gridPosition,
                "Driver_Status_ID" : packet.lapData.__getitem__(carindex).driverStatus,
                "Driver_Status" : ["In Garage", "Flying Lap", "In Lap", "Out Lap", "On Track"][packet.lapData.__getitem__(carindex).driverStatus],
                "Result_Status_ID" : packet.lapData.__getitem__(carindex).resultStatus,
                "Result_Status" : ["Invalid", "Inactive", "Active", "Finished", "Disqualified", "Not Classified", "Retired"][packet.lapData.__getitem__(carindex).resultStatus],
                })
        

        if isinstance(packet, PacketParticipantsData_V1):
            telemetry.update({
                "Num_Active_Cars" : packet.numActiveCars,
                "AI_Controlled" : packet.participants.__getitem__(carindex).aiControlled,
                "Driver_ID" : packet.participants.__getitem__(carindex).driverId,
                "Team_ID" : packet.participants.__getitem__(carindex).teamId,            
            })

            try:
                telemetry.update({"Driver" : DriverIDs[packet.participants.__getitem__(carindex).driverId]})
            except:
                telemetry.update({"Driver" : "Player"})

            try:
                telemetry.update({"Team" : TeamIDs[packet.participants.__getitem__(carindex).teamId]})
            except:
                telemetry.update({"Team" : "Not in a team"})

            telemetry.update({
                "Race_Number" : packet.participants.__getitem__(carindex).raceNumber,
                "Nationality_ID" : packet.participants.__getitem__(carindex).nationality,
            })
            telemetry.update({
                
                "Name" : packet.participants.__getitem__(carindex).name.decode('utf-8'),

                "Your_Telemetry_ID" : packet.participants.__getitem__(carindex).yourTelemetry,
                "Your_Telemetry" : ["Restricted", "Public"][packet.participants.__getitem__(carindex).yourTelemetry],            
            })


        if isinstance(packet, PacketCarSetupData_V1):
            telemetry.update({
                "Front_Wing" : packet.carSetups.__getitem__(carindex).frontWing,
                "Rear_Wing" : packet.carSetups.__getitem__(carindex).rearWing,
                "On_Throttle" : packet.carSetups.__getitem__(carindex).onThrottle,
                "Off_Throttle" : packet.carSetups.__getitem__(carindex).offThrottle,
                "Front_Camber" : packet.carSetups.__getitem__(carindex).frontCamber,
                "Rear_Camber" : packet.carSetups.__getitem__(carindex).rearCamber,
                "Front_Toe" : packet.carSetups.__getitem__(carindex).frontToe,
                "Rear_Toe" : packet.carSetups.__getitem__(carindex).rearToe,
                "Front_Suspension" : packet.carSetups.__getitem__(carindex).frontSuspension,
                "Rear_Suspension" : packet.carSetups.__getitem__(carindex).rearSuspension,
                "Front_Anti_Roll_Bar" : packet.carSetups.__getitem__(carindex).frontAntiRollBar,
                "Rear_Anti_Roll_Bar" : packet.carSetups.__getitem__(carindex).rearAntiRollBar,
                "Front_Suspension_Height" : packet.carSetups.__getitem__(carindex).frontSuspensionHeight,
                "Rear_Suspension_Height" : packet.carSetups.__getitem__(carindex).rearSuspensionHeight,
                "Brake_Pressure" : packet.carSetups.__getitem__(carindex).brakePressure,
                "Brake_Bias" : packet.carSetups.__getitem__(carindex).brakeBias,

                "Rear_Left_Tyre_Pressure" : packet.carSetups.__getitem__(carindex).rearLeftTyrePressure,
                "Rear_right_Tyre_Pressure" : packet.carSetups.__getitem__(carindex).rearRightTyrePressure,
                "Front_Left_Tyre_Pressure" : packet.carSetups.__getitem__(carindex).frontLeftTyrePressure,
                "Front_right_Tyre_Pressure" : packet.carSetups.__getitem__(carindex).frontRightTyrePressure,
                
                "Ballast" : packet.carSetups.__getitem__(carindex).ballast,
                "Fuel_Load" : packet.carSetups.__getitem__(carindex).fuelLoad,
            })


        if isinstance(packet, PacketCarTelemetryData_V1):
            telemetry.update({
                "Speed" : packet.carTelemetryData.__getitem__(carindex).speed,
                "Throttle" : packet.carTelemetryData.__getitem__(carindex).throttle,
                "Steer" : packet.carTelemetryData.__getitem__(carindex).steer,
                "Brake" : packet.carTelemetryData.__getitem__(carindex).brake,
                "Clutch" : packet.carTelemetryData.__getitem__(carindex).clutch,
                "Gear" : packet.carTelemetryData.__getitem__(carindex).gear,
                "Engine_RPM" : packet.carTelemetryData.__getitem__(carindex).engineRPM,
                "DRS" : packet.carTelemetryData.__getitem__(carindex).drs,
                "Rev_Lights_Percent" : packet.carTelemetryData.__getitem__(carindex).revLightsPercent,

                "Brakes_Temperature" : np.ctypeslib.as_array(packet.carTelemetryData.__getitem__(carindex).brakesTemperature).tolist(),
                # "Brakes_Temperature" : packet.carTelemetryData.__getitem__(carindex).brakesTemperature,

                "Tyres_Surface_Temperature" : np.ctypeslib.as_array(packet.carTelemetryData.__getitem__(carindex).tyresSurfaceTemperature).tolist(),
                # "Tyres_Surface_Temperature" : packet.carTelemetryData.__getitem__(carindex).tyresSurfaceTemperature,

                "Tyres_Inner_Temperature" : np.ctypeslib.as_array(packet.carTelemetryData.__getitem__(carindex).tyresInnerTemperature).tolist(),
                # "Tyres_Inner_Temperature" : packet.carTelemetryData.__getitem__(carindex).tyresInnerTemperature

                "Tyres_Pressure" : np.ctypeslib.as_array(packet.carTelemetryData.__getitem__(carindex).tyresPressure).tolist(),
                # "Tyres_Pressure" : packet.carTelemetryData.__getitem__(carindex).tyresPressure,

                "Surface_Type_ID" : np.ctypeslib.as_array(packet.carTelemetryData.__getitem__(carindex).surfaceType).tolist(),
                # "Surface_Type_ID" : packet.carTelemetryData.__getitem__(carindex).surfaceType,

                "Engine_Temperature" : packet.carTelemetryData.__getitem__(carindex).engineTemperature,
            })
            
            for x in range(4):
                telemetry.update({
                    "Tyre_{}_Surface_Temperature".format(tyres[x]) : packet.carTelemetryData.__getitem__(carindex).tyresSurfaceTemperature[x],
                    "Tyre_{}_Inner_Temperature".format(tyres[x]) : packet.carTelemetryData.__getitem__(carindex).tyresInnerTemperature[x],
                    "Tyre_{}_Brakes_Temperature".format(tyres[x]) : packet.carTelemetryData.__getitem__(carindex).brakesTemperature[x],
                    "Tyre_{}_Pressure".format(tyres[x]) : packet.carTelemetryData.__getitem__(carindex).tyresPressure[x],
                    "Tyre_{}_Surface_Type_ID".format(tyres[x]) : packet.carTelemetryData.__getitem__(carindex).surfaceType[x],
                    "Tyre_{}_Surface_Type".format(tyres[x]) : SurfaceTypes[packet.carTelemetryData.__getitem__(carindex).surfaceType[x]],
                })


        if isinstance(packet, PacketCarStatusData_V1):
            telemetry.update({
                "Traction_Control" : packet.carStatusData.__getitem__(carindex).tractionControl,
                "Anti_Lock_Brakes" : packet.carStatusData.__getitem__(carindex).antiLockBrakes,
                "Fuel_Mix_ID" : packet.carStatusData.__getitem__(carindex).fuelMix,
                "Fuel_Mix" : ["Lean", "Standart", "Rich", "Max"][packet.carStatusData.__getitem__(carindex).fuelMix],
                "Front_Brake_Bias" : packet.carStatusData.__getitem__(carindex).frontBrakeBias,
                "Pit_Limiter_Status" : packet.carStatusData.__getitem__(carindex).pitLimiterStatus,
                "Fuel_In_Tank" : packet.carStatusData.__getitem__(carindex).fuelInTank,
                "Fuel_Capacity" : packet.carStatusData.__getitem__(carindex).fuelCapacity,
                "Fuel_Remaining_Laps" : packet.carStatusData.__getitem__(carindex).fuelRemainingLaps,
                "Max_RPM" : packet.carStatusData.__getitem__(carindex).maxRPM,
                "Idle_RPM" : packet.carStatusData.__getitem__(carindex).idleRPM,
                "Max_Gears" : packet.carStatusData.__getitem__(carindex).maxGears,
                "DRS_Allowed" : packet.carStatusData.__getitem__(carindex).drsAllowed,

                "Tyres_Wear" : np.ctypeslib.as_array(packet.carStatusData.__getitem__(carindex).tyresWear).tolist(),
                # "Tyres_Wear" : packet.carStatusData.__getitem__(carindex).tyresWear,

                "Actual_Tyre_Compound_ID" : packet.carStatusData.__getitem__(carindex).actualTyreCompound,
                "Actual_Tyre_Compound" : {16:"F1 Modern C5", 17:"F1 Modern C4", 18:"F1 Modern C3", 19:"F1 Modern C2", 20:"F1 Modern C1", 7:"F1 Modern Intermidiate", 8:"F1 Modern Wet", 9:"F1 Classic Dry",10:"F1 Classic Wet", 11: "F2 Super Soft", 12 : "F2 Soft", 14 : "F2 Medium", 15: "F2 Wet"}[packet.carStatusData.__getitem__(carindex).actualTyreCompound],
                "Visual_Tyre_Compound_ID" : packet.carStatusData.__getitem__(carindex).visualTyreCompound,


                "Tyres_Damage" : np.ctypeslib.as_array(packet.carStatusData.__getitem__(carindex).tyresDamage).tolist(),
                # "Tyres_Damage" : packet.carStatusData.__getitem__(carindex).tyresDamage,


                "Front_Left_Wing_Damage" : packet.carStatusData.__getitem__(carindex).frontLeftWingDamage,
                "Front_Right_Wing_Damage" : packet.carStatusData.__getitem__(carindex).frontRightWingDamage,
                "Rear_Wing_Damage" : packet.carStatusData.__getitem__(carindex).rearWingDamage,
                "Engine_Damage" : packet.carStatusData.__getitem__(carindex).engineDamage,
                "Gearbox_Damage" : packet.carStatusData.__getitem__(carindex).gearBoxDamage,
                "Vehicle_FIA_Flags_ID" : packet.carStatusData.__getitem__(carindex).vehicleFiaFlags,
                "Vehicle_FIA_Flags" : {-1:"Invalid", 0:"None", 1:"Green", 2:"Blue", 3:"Yellow", 4:"Red"}[packet.carStatusData.__getitem__(carindex).vehicleFiaFlags],
                "ERS_Store_Energy" : packet.carStatusData.__getitem__(carindex).ersStoreEnergy,
                "ERS_Deploy_Mode_ID" : packet.carStatusData.__getitem__(carindex).ersDeployMode,
                "ERS_Deploy_Mode" : ["None", "Low", "Medium", "High", "Overtake", "Hotlap"][packet.carStatusData.__getitem__(carindex).ersDeployMode],
                "ERS_Harvested_This_Lap_MGUK" : packet.carStatusData.__getitem__(carindex).ersHarvestedThisLapMGUK,
                "ERS_Harvested_This_Lap_MGUH" : packet.carStatusData.__getitem__(carindex).ersHarvestedThisLapMGUH,
                "ERS_Deployed_This_Lap" : packet.carStatusData.__getitem__(carindex).ersDeployedThisLap,
            })

            for x in range(4):
                telemetry.update({
                    "Tyre_{}_Wear".format(tyres[x]) : packet.carStatusData.__getitem__(carindex).tyresWear[x],
                    "Tyre_{}_Damage".format(tyres[x]) : packet.carStatusData.__getitem__(carindex).tyresDamage[x],
                })
        for item in telemetry:
            typ = type(telemetry[item])
            if typ != str and typ != int and typ != float and typ != list:
                print(item)
                print(telemetry[item])
                print(typ)
                print('\n')

        #write data to json file
        try:
            with open('telemetry.json', 'w') as fp:
                json.dump(telemetry, fp)
                fp.close()
        except Exception as e:
            print(e)
if __name__ == "__main__":
    main()