import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Button, CircularProgress, withStyles } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class UploadButton extends PureComponent {
  render() {
    const { children, classes, loading, success } = this.props;

    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });
    
    return (
      <>
        <input
          accept="image/*"
          style={{display: 'none '}}
          id="contained-button-file"
          type="file"
          onChange={this.props.onUpload}
        />
        <label htmlFor="contained-button-file" className={classes.wrapper}>
          <Button variant="contained" component="span" color="secondary" disabled={loading} className={buttonClassname}>
            {children}
          </Button>
          {loading && <CircularProgress size={24} color="secondary" className={classes.buttonProgress} />}
        </label>
      </>
    )
  }
}

export default withStyles(styles)(UploadButton);