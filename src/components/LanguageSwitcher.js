// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import Select from 'react-select';

// const languageOptions = [
//     { value: 'en', label: 'English' },
//     { value: 'fr', label: 'French' },
// ];

// function LanguageSwitcher() {
//     const { i18n } = useTranslation();

//     const handleChangeLanguage = (selectedOption) => {
//         i18n.changeLanguage(selectedOption.value);
//     };

//     const customStyles = {
//         control: (provided, state) => ({
//             ...provided,
//             border: state.isFocused ? '1.5px solid rgb(156 163 175)' : '1.5px solid #ccc',
//             borderRadius: '4px',
//             boxShadow: 'none',
//             paddingTop: '2px',
//             paddingBottom: '2px',
//             width: '150px',
//             '&:hover': {
//                 cursor: 'pointer',
//             },
//         }),
//     };

//     return (
//         <Select
//             className="w-fit"
//             styles={customStyles}
//             options={languageOptions}
//             onChange={handleChangeLanguage}
//             defaultValue={languageOptions.find((option) => option.value === i18n.language)}
//         />
//     );
// }

// export default LanguageSwitcher;


import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher({classes}) {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className='text-base space-x-6 pt-1 pl-3' >
      <button onClick={() => handleChangeLanguage('en')}>English</button>
      <button onClick={() => handleChangeLanguage('fr')}>French</button>
    </div>
  );
}

export default LanguageSwitcher;
