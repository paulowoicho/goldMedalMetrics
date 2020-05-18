var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./gold_medals.sqlite');

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {
  return `create table Country (
    name TEXT not null,
    code TEXT not null,
    gdp integer,
    population integer
  )`;
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {
  return `create table GoldMedal(
    id integer primary key not null,
    year integer not null,
    city text not null,
    season text not null,
    name text not null,
    country text not null,
    gender text not null,
    sport text not null,
    discipline text not null,
    event text not null
  )`;
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = country => {
    return `select count(*) as count 
    from GoldMedal 
    where country = '${country}'`;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const mostSummerWins = country => {
  return `with summerWins as (
    select year, count(*) as count 
    from GoldMedal
    where country = '${country}' and season = 'Summer'
    group by year) 
    
    select year, max(count) as count
    from summerWins`;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = country => {
  return `with winterWins as (
    select year, count(*) as count 
    from GoldMedal
    where country = '${country}' and season = 'Winter'
    group by year) 
    
    select year, max(count) as count
    from winterWins`;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestYear = country => {
  return `with yearGroup as (select year, count(*) as count
  from GoldMedal
  where country = '${country}'
  group by year)
  
  select year, max(count) as count from yearGroup`;
};

/*
Returns a SQL query string that will find the discipline this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = country => {
  return `with disciplineGroup as (
    select discipline, count(*) as count
    from GoldMedal
    where country = '${country}'
    group by discipline
  )
  
  select discipline, max(count) from disciplineGroup`;
};

/*
Returns a SQL query string that will find the sport this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = country => {
  return `with sportGroup as (
    select sport, count(*) as count
    from GoldMedal
    where country = '${country}'
    group by sport
  )
  
  select sport, max(count) from sportGroup`;
};

/*
Returns a SQL query string that will find the event this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = country => {
  return `with eventGroup as (
    select event, count(*) as count
    from GoldMedal
    where country = '${country}'
    group by event
  )
  
  select event, max(count) from eventGroup`;
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const numberMenMedalists = country => {
  return `select name ,count(distinct name)
  from GoldMedal
  where country = '${country}' and gender = 'Men'` ;
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = country => {
  return `select name ,count(distinct name)
  from GoldMedal
  where country = '${country}' and gender = 'Women'` ;
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = country => {
  return `with distinctAthletes as (
    select name, count(distinct name) as count
    from GoldMedal
    where country= '${country}')
  
  select name, max(count) from distinctAthletes`;
};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/

const orderedMedals = (country, field, sortAscending) => {
  let rootQuery = `select * from GoldMedal
  where country = '${country}'`

  if(field){
    if(sortAscending){
      return `${rootQuery} order by ${field} asc`
    }else{
      return `${rootQuery} order by ${field} desc`
    }
  }else{
    return rootQuery;
  }
};

/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
  let rootQuery = `select sport, count(sport) as count,  count(sport) * 100.00 / (select count(*) from GoldMedal where country = '${country}') as percent
    from GoldMedal
    where country = '${country}'
    group by sport`;
  
  if(field){
    if(sortAscending){
      return `${rootQuery} order by ${field} asc`
    }else {
      return `${rootQuery} order by ${field} desc`
    }
  }else{
    return rootQuery;
  }
};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports
};
