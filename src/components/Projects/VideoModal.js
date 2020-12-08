import React, {useState} from 'react';
import {Modal, Button, makeStyles} from '@material-ui/core';
import YouTubeVideo from '../YoutubeVideo';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import {useTranslation} from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    maxWidth: '940px',
    width: '100%',
    height: '100%',
    margin: '0 auto',
    display: 'table',
    outline: 'none',
    '& .inner': {
      display: 'table-cell',
      verticalAlign: 'middle',
      width: '100%',
      height: '100%',
    },
  },
}));

const VideoModal = ({videoId}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={handleOpen}
        startIcon={<PlayArrowOutlinedIcon />}
      >
        {t('play video')}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        disableAutoFocus
        aria-labelledby="project-video-modal"
        aria-describedby="video-modal-for-project"
        disableScrollLock={true}
        className={classes.modal}
      >
        <div className={classes.modalContent} onClick={handleClose}>
          <div className="inner">
            <YouTubeVideo videoId={videoId} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VideoModal;
