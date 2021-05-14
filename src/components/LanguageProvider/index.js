import {useEffect} from 'react';
import {useTranslation} from 'next-i18next';
import {connect} from 'react-redux';
import {setLanguage} from '../../store';

const getLanguage = () => {
  if (!window || !window.navigator) {
    return 'en';
  }

  const lang =
    (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    window.navigator.browserLanguage;
  if (lang && typeof lang === 'string' && lang.indexOf('ja') !== -1) {
    return 'ja';
  }

  return 'en';
};

const LanguageProvider = (props) => {
  const {language, force, setLanguage} = props;
  const {i18n} = useTranslation();

  useEffect(() => {
    //NOTE: detect language preference
    const browserLanguage = getLanguage();
    if (!force) {
      setLanguage({language: browserLanguage, force: false});
    }
  }, []);

  useEffect(() => {
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return props.children;
};

const mapStateToProps = (state) => {
  return {
    language: state.lang.language,
    force: state.lang.force,
  };
};

export default connect(mapStateToProps, {setLanguage})(LanguageProvider);
