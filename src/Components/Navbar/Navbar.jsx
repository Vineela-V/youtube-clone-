import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip, Menu, MenuItem, InputBase,useMediaQuery,Drawer,Divider,List,ListItem,ListItemIcon,ListItemText,} from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MicIcon from "@mui/icons-material/Mic";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const SearchWrapper = styled("div")(({ theme }) => ({
  backgroundColor: alpha(theme.palette.text.primary, 0.05),
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: 300,
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flexGrow: 1,
  paddingLeft: theme.spacing(1),
}));

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleVoiceSearch = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      navigate(`/search?q=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Youtube
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SearchWrapper>
                <SearchInput
                  placeholder="Search…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  inputProps={{ "aria-label": "search" }}
                />
                <IconButton onClick={handleSearch} color="inherit">
                  <SearchIcon />
                </IconButton>
              </SearchWrapper>

              <Tooltip title="Voice Search">
                <IconButton onClick={handleVoiceSearch} color="inherit">
                  <MicIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton color="inherit" onClick={handleProfileClick}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleCloseProfileMenu}>My Account</MenuItem>
              <MenuItem onClick={handleCloseProfileMenu}>Settings</MenuItem>
              <MenuItem onClick={handleCloseProfileMenu}>Signin</MenuItem>
              <MenuItem onClick={handleCloseProfileMenu}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="top" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box p={2} role="presentation" sx={{ width: "100%" }}>
          <SearchWrapper sx={{ mb: 2 }}>
            <SearchInput
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton onClick={handleSearch} color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleVoiceSearch} color="inherit">
              <MicIcon />
            </IconButton>
          </SearchWrapper>
          <Divider />
          <List>
            <ListItem button onClick={() => setMobileOpen(false)}>
              <ListItemText primary="Close" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
