import React, {useState} from 'react';
import {Modal, Button, Box} from '@material-ui/core';
import YouTubeVideo from '../YoutubeVideo';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import {useTranslation} from 'react-i18next';

const VideoModal = ({videoId}) => {
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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <YouTubeVideo videoId={videoId} />
      </Modal>
    </>
  );
};

export default VideoModal;
