import React, { useState } from "react";
import {AppBar,Toolbar,Typography,IconButton,Box,Tooltip,Menu,MenuItem,} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MicIcon from "@mui/icons-material/Mic";
import InputBase from "@mui/material/InputBase";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const SearchWrapper = styled("div")(({ theme }) => ({
  backgroundColor: alpha(theme.palette.text.primary, 0.05),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 300,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flexGrow: 1,
  paddingLeft: theme.spacing(1),
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
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
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          YouTube Clone
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SearchWrapper>
            <SearchInput
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              inputProps={{ "aria-label": "search" }}
            />
            <SearchButton
              onClick={handleSearch}
              aria-label="search button"
              color="inherit"
            >
              <SearchIcon />
            </SearchButton>
          </SearchWrapper>

          <Tooltip title="Voice Search">
            <IconButton onClick={handleVoiceSearch} color="inherit">
              <MicIcon />
            </IconButton>
          </Tooltip>

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
  );
};

export default Navbar;
