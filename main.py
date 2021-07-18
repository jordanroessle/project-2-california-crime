import requests
from census import Census
from us import states
import pandas as pd
import json
from sqlalchemy import create_engine

#import API keys
from config import api_key1, api_key2

# Obtaining Census data
print('Step 1: Obtaining and cleaning Census data from API...', end='')

c = Census(api_key1)
census_data = c.acs5.get(('NAME', 'B01003_001E', 'B02001_002E', 'B02001_003E', 'B02001_004E', 'B02001_005E',  
                          'B02001_006E', 'B03002_012E', 'B02001_007E', 'B02001_008E', 'B17001_002E',  
                          'B19013_001E', 'B19301_001E', 'B23025_004E', 'B23025_005E', 'B23025_006E'),  
                          geo={'for': 'county:*', 'in': 'state:{}'.format(states.CA.fips)})

# Converting to DataFrame
census_df = pd.DataFrame(census_data)

census_df.rename(columns={'NAME': 'County',
                          'B01003_001E': 'Population', 
                          'B02001_002E': 'White', 
                          'B02001_003E': 'African_american', 
                          'B02001_004E': 'American_indian_alaskan_native', 
                          'B02001_005E': 'Asian', 
                          'B02001_006E': 'Pacific_islander', 
                          'B03002_012E': 'Hispanic_latino', 
                          'B02001_007E': 'Other_race', 
                          'B02001_008E': 'Multiple_races', 
                          'B17001_002E': 'Poverty_count', 
                          'B19013_001E': 'Income_median', 
                          'B19301_001E': 'Income_per_capita', 
                          'B23025_004E': 'Employed', 
                          'B23025_005E': 'Unemployed', 
                          'B23025_006E': 'Armed_forces_active'
                         }, inplace=True)

# Drop unneeded columns
census_df.drop(columns=['state', 'county'], inplace=True)

# Remove 'County, California' from County column
census_df.County = census_df.County.map(lambda x: x[ :-19])

# Set index to County
census_df.set_index('County', inplace=True)

# Create additional columns to calculate the population percentages

census_df['%_White'] = round((census_df.White / census_df.Population) * 100, 2)
census_df['%_African_american'] = round((census_df.African_american / census_df.Population) * 100, 2)
census_df['%_American_indian_alaskan_native'] = round((census_df.American_indian_alaskan_native / census_df.Population) * 100, 2)
census_df['%_Asian'] = round((census_df.Asian / census_df.Population) * 100, 2)
census_df['%_Pacific_islander'] = round((census_df.Pacific_islander / census_df.Population) * 100, 2)
census_df['%_Hispanic_latino'] = round((census_df.Hispanic_latino / census_df.Population) * 100, 2)
census_df['%_Other_race'] = round((census_df.Other_race / census_df.Population) * 100, 2)
census_df['%_Multiple_races'] = round((census_df.Multiple_races / census_df.Population) * 100, 2)
census_df['%_Poverty'] = round((census_df.Poverty_count / census_df.Population) * 100, 2)
census_df['%_Employed'] = round((census_df.Employed / census_df.Population) * 100, 2)
census_df['%_Unemployed'] = round((census_df.Unemployed / census_df.Population) * 100, 2)
census_df['%_Armed_forces_active'] = round((census_df.Armed_forces_active / census_df.Population) * 100, 2)

# Reorganize columns
census_df = census_df[['Population', 'Income_median', 'Income_per_capita', '%_Poverty', '%_Employed', '%_Unemployed', 
                       '%_Armed_forces_active', '%_African_american', '%_American_indian_alaskan_native', '%_Asian', 
                      '%_Hispanic_latino', '%_Pacific_islander', '%_White', '%_Other_race', '%_Multiple_races', 
                      'Poverty_count', 'Employed', 'Unemployed', 'Armed_forces_active', 'African_american', 
                      'American_indian_alaskan_native', 'Asian', 'Hispanic_latino', 'Pacific_islander', 
                      'White', 'Other_race', 'Multiple_races']]

# Convert to CSV
census_df.to_csv('static/data/census_data.csv')

print(' Complete\nStep 2: Obtaining and cleaning ORI data...', end='')

# Obtaining ORI Data

url = "https://api.usa.gov/crime/fbi/sapi/"

state_abbrv = "CA"
departments = [] 
department_name = []
county_name = []
state_abbr = [] 
ori = []

response = json.loads(requests.get(f'{url}api/agencies/byStateAbbr/{state_abbrv}?API_KEY={api_key2}').text)

for i in range(len(response["results"])):
        departments.append(response["results"][i])
        department_name.append(response["results"][i]["agency_name"])
        county_name.append(response["results"][i]["county_name"])
        ori.append(response["results"][i]["ori"])
        state_abbr.append(response["results"][i]["state_abbr"])

## Converting to DataFrame 
ori_df = pd.DataFrame({"Department_Name": department_name,
                        "State": state_abbr,
                        "County": county_name,
                        "Ori": ori,
                        })

print(' Complete\nStep 3: Obtaining and cleaning Crime data...', end='')

# Obtaining Crime Data

crime_data = []

#types of crimes 
assault_a = []
sex_offense = []
man_neg = []
murder = []
rape = []
robbery = []
assault_s = []
ht_c = []
ht_i = []
total = []

for i in range(len(departments)):
    response = json.loads(requests.get(f'{url}api/arrest/agencies/offense/{departments[i]["ori"]}/violent_crime/2019/2019?API_KEY={api_key2}').text)
    crime_data.append(response)

for i in range(len(crime_data)):
    if len(crime_data[i]["data"]) == 0:
        assault_a.append("N/A")
        sex_offense.append("N/A")
        man_neg.append("N/A")
        murder.append("N/A")
        rape.append("N/A")
        robbery.append("N/A")
        assault_s.append("N/A")
        ht_c.append("N/A")
        ht_i.append("N/A")
        total.append("N/A")
    else:
        assault_a.append(crime_data[i]["data"][0]["value"])
        sex_offense.append(crime_data[i]["data"][1]["value"])
        man_neg.append(crime_data[i]["data"][2]["value"])
        murder.append(crime_data[i]["data"][3]["value"])
        rape.append(crime_data[i]["data"][4]["value"])
        robbery.append(crime_data[i]["data"][5]["value"])
        assault_s.append(crime_data[i]["data"][6]["value"])
        ht_c.append(crime_data[i]["data"][7]["value"])
        ht_i.append(crime_data[i]["data"][8]["value"])
        total.append(assault_a[i] + sex_offense[i] + man_neg[i] + murder[i] + rape[i] + robbery[i] + assault_s[i] + ht_c[i] + ht_i[i])

# Converting to DataFrame
crimes_df = pd.DataFrame({"Ori": ori,
                           "Agg_Assult": assault_a,
                           "Sex_Offences":sex_offense,
                           "Manslaughter_Neg": man_neg, 
                           "Murder_and_Nonneg_Man": murder,  
                           "Rape": rape,  
                           "Robbery": robbery, 
                           "Simp_Assult": assault_s,  
                           "Humman_Trafficking_Commercial_SA": ht_c, 
                           "Humman_Trafficking_Invol_Ser": ht_i,
                           "Offences_Total": total
                          })

# Merge two DFs
ca_crimes_df = pd.merge(ori_df, crimes_df, how='right', on='Ori')

# Convert to CSV
ca_crimes_df.to_csv('static/data/CA_Crime.csv')

print(' Complete\nStep 4: Adding cleaned DataFrames to SQLite database...', end='')

# Connect to local database

engine = create_engine('sqlite:///static/data/ca_crime.db')
sqlite_connection = engine.connect()

# Load census_df into DB
census_df.to_sql('countyDemographics', sqlite_connection, if_exists='replace')

# Load ca_crimes_df into DB

ca_crimes_df.to_sql('crimesByDepartment', sqlite_connection, if_exists='replace')

# Close connection
sqlite_connection.close()

# Print to terminal
print(' Complete')
