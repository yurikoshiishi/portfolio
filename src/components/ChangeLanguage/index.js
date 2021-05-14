import React, {useState} from 'react';
import {connect} from 'react-redux';
import {setLanguage} from '../../store';
import {Button, Menu, MenuItem} from '@material-ui/core';
import TranslateOutlinedIcon from '@material-ui/icons/TranslateOutlined';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import {useRouter} from 'next/dist/client/router';

const LANGUAGE_MAP = {
  en: 'English',
  ja: '日本語',
};

const ChangeLanguage = ({language}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (language) => {
    router.push('/', undefined, {
      locale: language,
    });
    handleClose();
  };

  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<TranslateOutlinedIcon />}
        endIcon={<ExpandMoreOutlinedIcon />}
      >
        {LANGUAGE_MAP[language] ? LANGUAGE_MAP[language] : 'Language'}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock={true}
      >
        <MenuItem onClick={() => handleChangeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => handleChangeLanguage('ja')}>日本語</MenuItem>
      </Menu>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.lang.language,
  };
};

export default connect(mapStateToProps, {setLanguage})(ChangeLanguage);
