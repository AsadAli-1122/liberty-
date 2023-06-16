import { useEffect, useMemo, useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import '../css/CountryStateCity.css';

const CountryStateCity = ({ onChange, value }) => {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const countries = useMemo(() => {
    const countryOptions = Country.getAllCountries().map((c) => {
      return {
        label: c.name,
        flag: c.flag,
        value: c.isoCode
      };
    });
    return [{ label: "Select country", value: null }, ...countryOptions];
  }, []);

  const updatedState = (country) => {
    const stateOptions = State.getStatesOfCountry(country).map((s) => {
      return {
        label: s.name,
        value: s.isoCode
      };
    });
    return [{ label: "Select state", value: null }, ...stateOptions];
  };

  const updatedCities = (country, state) => {
    const cityOptions = City.getCitiesOfState(country, state).map((s) => {
      return {
        label: s.name,
        value: s.stateCode
      };
    });
    return [{ label: "Select city", value: null }, ...cityOptions];
  };

  useEffect(() => {
    if (value && value.country) {
      setCountry(value.country);
      setState(value.state || null);
      setCity(value.city || null);
    }
  }, [value]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1.5px solid rgb(156 163 175)" : "1.5px solid #ccc",
      borderRadius: "4px",
      boxShadow: "none",
      "&:hover": {
        cursor: "pointer",
      },
    }),
  };

  const handleCountryChange = (value) => {
    setCountry(value);
    setState(null);
    setCity(null);
    if (onChange) {
      onChange(value, null, null);
    }
  };

  const handleStateChange = (value) => {
    setState(value);
    setCity(null);
    if (onChange) {
      onChange(country, value, null);
    }
  };

  const handleCityChange = (value) => {
    setCity(value);
    if (onChange) {
      onChange(country, state, value);
    }
  };

  return (
    <>
      <Select
        id="country"
        className="w-full"
        styles={customStyles}
        name="country"
        label="country"
        options={countries}
        value={country}
        onChange={handleCountryChange}
        isClearable={true}
        placeholder="Country"
      />
     <Select
        id="state"
        name="state"
        className="w-full"
        styles={customStyles}
        label="state"
        options={country ? updatedState(country.value) : []}
        value={state}
        onChange={handleStateChange}
        isClearable={true}
        placeholder="State"
        isDisabled={!country}
      />
      <Select
       id="city"
       name="city"
       className="w-full"
       styles={customStyles}
       label="city"
       options={
         country && state ? updatedCities(country.value, state.value) : []
       }
       value={city}
        onChange={handleCityChange}
        isClearable={true}
        placeholder="City"
        isDisabled={!state}
      />
    </>
  );
}

export default CountryStateCity;
