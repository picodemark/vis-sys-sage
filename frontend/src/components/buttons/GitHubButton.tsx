import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';

export default function GitHubButton() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="secondary">
        <GitHubIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}>
        <MenuItem onClick={handleClose}>
          <Link
            href="https://github.com/stepanvanecek/sys-sage"
            underline="none"
            target="_blank"
            rel="noopener">
            {'sys-sage'}
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            href="https://gitlab.lrz.de/vis-sys-sage/vis-sys-sage"
            underline="none"
            target="_blank"
            rel="noopener">
            {'vis-sys-sage'}
          </Link>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
