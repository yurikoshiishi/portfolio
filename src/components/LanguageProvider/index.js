import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';

const LanguageProvider = (props) => {
  const {lang} = props;
  const {i18n} = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return props.children;
};

const mapStateToProps = (state) => {
  return {
    lang: state.language,
  };
};

export default connect(mapStateToProps)(LanguageProvider);
