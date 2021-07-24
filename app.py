from typing import Text
import numpy as np

import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import Column, Integer, String, Float 
from flask import Flask, jsonify
from sqlalchemy.sql.sqltypes import Float


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///static/data/ca_crime.sqlite")
conn = engine.connect()
# reflect an existing database into a new model
Base = declarative_base()

#create class crimes
class Crimes(Base):
        __tablename__ = 'crimesByDepartment'
        rowid = Column(Integer, primary_key=True)
        #index',
        Department_Name = Column(String) 
        State = Column(String) 
        County = Column(String) 
        Ori = Column(String) 
        Agg_Assult = Column(Integer)
        Sex_Offences = Column(Integer)
        Manslaughter_Neg = Column(Integer)
        Murder_and_Nonneg_Man = Column(Integer)
        Rape = Column(Integer)
        Robbery = Column(Integer)
        Simp_Assult = Column(Integer)
        Humman_Trafficking_Commercial_SA = Column(Integer)
        Humman_Trafficking_Invol_Ser = Column(Integer)
        Offences_Total = Column(Integer)


#create class Demographics
class Demographics(Base):
        __tablename__ = 'countyDemographics'
        rowid = Column(Integer, primary_key=True)
        County = Column(String)
        Population = Column(Float)
        Income_median = Column(Float)
        Income_per_capita = Column(Float)
        Per_Poverty = Column(Float)
        Per_Employed = Column(Float)
        Per_Unemployed = Column(Float)
        Per_Armed_forces_active = Column(Float)
        Per_African_american = Column(Float)
        Per_American_indian_alaskan_native = Column(Float)
        Per_Asian = Column(Float)
        Per_Hispanic_latino = Column(Float)
        Per_Pacific_islander = Column(Float)
        Per_White = Column(Float)
        Per_Other_race = Column(Float)
        Per_Multiple_races = Column(Float)
        Poverty_count = Column(Float)
        Employed = Column(Float)
        Unemployed = Column(Float)
        Armed_forces_active = Column(Float)
        African_american = Column(Float)
        American_indian_alaskan_native = Column(Float)
        Asian = Column(Float)
        Hispanic_latino = Column(Float)
        Pacific_islander = Column(Float)
        White = Column(Float)
        Other_race = Column(Float)
        Multiple_races = Column(Float)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/crimes<br/>"
        f"/api/v1.0/demographics"
    )


@app.route("/api/v1.0/crimes")



def crime():
    # Create our session (link) from Python to the DB
    session = Session(bind=engine)

    # Query all crimes
    results_crime = session.query(Crimes.Department_Name
                        , Crimes.State
                        , Crimes.County
                        , Crimes.Ori
                        , Crimes.Agg_Assult
                        , Crimes.Sex_Offences
                        , Crimes.Manslaughter_Neg
                        , Crimes.Murder_and_Nonneg_Man
                        , Crimes.Rape
                        , Crimes.Robbery
                        , Crimes.Simp_Assult
                        , Crimes.Humman_Trafficking_Commercial_SA
                        , Crimes.Humman_Trafficking_Invol_Ser
                        , Crimes.Offences_Total
                       ).all()

    session.close()
    
    print(results_crime)

    # # Convert list of tuples into normal list
    all_crimes = list(np.ravel(results_crime))

    return jsonify(all_crimes)


@app.route("/api/v1.0/demographics")



def demographic():
# Create our session (link) from Python to the DB
    session = Session(bind=engine)

    # Query all crimes
    results_demographic = session.query(Demographics.County
                        , Demographics.Population
                        , Demographics.Income_median
                        , Demographics.Income_per_capita
                        # , Demographics.%_Poverty
                        # , Demographics.%_Employed 
                        # , Demographics.%_Unemployed 
                        # , Demographics.%_Armed_forces_active  
                        # , Demographics.%_African_american 
                        # , Demographics.%_American_indian_alaskan_native 
                        # , Demographics.%_Asian 
                        # , Demographics.%_Hispanic_latino 
                        # , Demographics.%_Pacific_islander 
                        # , Demographics.%_White  
                        # , Demographics.%_Other_race 
                        # , Demographics.%_Multiple_races 
                        , Demographics.Poverty_count 
                        , Demographics.Employed 
                        , Demographics.Unemployed  
                        , Demographics.Armed_forces_active  
                        , Demographics.African_american   
                        , Demographics.American_indian_alaskan_native
                        , Demographics.Asian
                        , Demographics.Hispanic_latino
                        , Demographics.Pacific_islander
                        , Demographics.White
                        , Demographics.Other_race
                        , Demographics.Multiple_races 
                       ).all()

    session.close()
    
    print(results_demographic)

    return jsonify(results_demographic)

if __name__ == '__main__':
    app.run(debug=True)
