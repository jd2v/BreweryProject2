-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/ru0hro
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.
Drop Table "Breweries";
Drop Table "CountyDemographics";


CREATE TABLE "CountyDemographics" (
    "CountyID" INT   NOT NULL,
    "Stabr" VARCHAR(255)   NOT NULL,
    "area_name" VARCHAR(255)   NOT NULL,
    "median_HHI_2019" INT   NOT NULL,
    "bach_deg_14to18" FLOAT   NOT NULL,
    CONSTRAINT "pk_CountyDemographics" PRIMARY KEY (
        "CountyID"
     )
);

Copy "CountyDemographics" (
    "CountyID",
    "Stabr",
    "area_name",
    "median_HHI_2019",
    "bach_deg_14to18"
	)
	From 'C:\PZBrew\Clean_data\countydemographicsv1.csv' DELIMITER ',' CSV HEADER;


CREATE TABLE "Breweries" (
    "Index" INT   NOT NULL,
    "BreweryName" VARCHAR(255)   NOT NULL,
    "BreweryType" VARCHAR(255)   NOT NULL,
    "Latitude" FLOAT   NOT NULL,
    "Longitude" FLOAT   NOT NULL,
    "County" VARCHAR(255)   NOT NULL,
    "State" VARCHAR(255)   NOT NULL,
    "CountyID" INT   NOT NULL,
    CONSTRAINT "pk_Breweries" PRIMARY KEY (
        "Index"
		)
     );

Copy "Breweries" (
    "Index",
    "BreweryName",
    "BreweryType",
    "Latitude",
    "Longitude",
    "County",
    "State",
    "CountyID"
	) 
	From 'C:\PZBrew\Clean_data\breweries_v1.csv' DELIMITER ',' CSV HEADER;	


ALTER TABLE "Breweries" ADD CONSTRAINT "fk_Breweries_CountyID" FOREIGN KEY("CountyID")
REFERENCES "CountyDemographics" ("CountyID");


select * from "Breweries";
select * from "CountyDemographics";