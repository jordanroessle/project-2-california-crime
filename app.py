from typing import Text
import numpy as np

import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import Column, Integer, String, Float 
from flask import Flask, jsonify, render_template
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
        Department_Name = Column(String) 
        State = Column(String) 
        County = Column(String) 
        Ori = Column(String) 
        Lat = Column(Float)
        Lon = Column(Float)
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
        pct_Poverty = Column(Float)
        pct_Employed = Column(Float)
        pct_Unemployed = Column(Float)
        pct_Armed_forces_active = Column(Float)
        pct_African_american = Column(Float)
        pct_American_indian_alaskan_native = Column(Float)
        pct_Asian = Column(Float)
        pct_Hispanic_latino = Column(Float)
        pct_Pacific_islander = Column(Float)
        pct_White = Column(Float)
        pct_Other_race = Column(Float)
        pct_Multiple_races = Column(Float)
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
    return render_template("index.html")

@app.route("/compareCities")
def compareCities():
    return render_template("visuals.html")


@app.route("/api/v1.0/crimes")
def crime():
    # Create our session (link) from Python to the DB
    session = Session(bind=engine)

    # Query all crimes
    results_crime = session.query(Crimes.Department_Name
                        , Crimes.State
                        , Crimes.County
                        , Crimes.Ori
                        , Crimes.Lat
                        , Crimes.Lon
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

    # grab column names
    column_names = Crimes.__table__.columns.keys()
    # pop rowid
    column_names.pop(0)
    
    # make list of dictionaries to be returned
    return_list = []
    for department in results_crime:
        return_list.append(dict(zip(column_names, department)))

    return jsonify(return_list)


@app.route("/api/v1.0/demographics")



def demographic():
# Create our session (link) from Python to the DB
    session = Session(bind=engine)

    # Query all crimes
    results_demographic = session.query(Demographics.County
                        , Demographics.Population
                        , Demographics.Income_median
                        , Demographics.Income_per_capita
                        , Demographics.pct_Poverty
                        , Demographics.pct_Employed 
                        , Demographics.pct_Unemployed 
                        , Demographics.pct_Armed_forces_active  
                        , Demographics.pct_African_american 
                        , Demographics.pct_American_indian_alaskan_native 
                        , Demographics.pct_Asian 
                        , Demographics.pct_Hispanic_latino 
                        , Demographics.pct_Pacific_islander 
                        , Demographics.pct_White  
                        , Demographics.pct_Other_race 
                        , Demographics.pct_Multiple_races 
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

    # grab column names
    column_names = Demographics.__table__.columns.keys()
    # pop rowid
    column_names.pop(0)
    
    # make list of dictionaries to be returned
    return_list = []
    for county in results_demographic:
        return_list.append(dict(zip(column_names, county)))

    return jsonify(return_list)

if __name__ == '__main__':
    app.run(debug=True)
