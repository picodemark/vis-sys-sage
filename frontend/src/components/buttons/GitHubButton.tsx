import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

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
      <Tooltip title="GitHub Links">
        <IconButton onClick={handleClick} color="secondary">
          <GitHubIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <Link
            href="https://github.com/caps-tum/sys-sage"
            underline="none"
            target="_blank"
            rel="noopener">
            sys-sage
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            href="https://github.com/picodemark/vis-sys-sage"
            underline="none"
            target="_blank"
            rel="noopener">
            vis-sys-sage
          </Link>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
