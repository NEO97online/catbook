import React, { PureComponent } from 'react';
import { Button, CircularProgress, withStyles } from '@material-ui/core';

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
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
    const { children, classes, loading } = this.props;
    
    return (
      <div>
        <input
          accept="image/*"
          style={{display: 'none '}}
          id="contained-button-file"
          type="file"
          onChange={this.props.onUpload}
        />
        <label htmlFor="contained-button-file" className={classes.wrapper}>
          <Button variant="contained" component="span" color="secondary" disabled={loading}>
            {children}
          </Button>
          {loading && <CircularProgress size={24} color="secondary" className={classes.buttonProgress} />}
        </label>
      </div>
    )
  }
}

export default withStyles(styles)(UploadButton);