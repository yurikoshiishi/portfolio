import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Arial",
      '"Hiragino Kaku Gothic Pro"',
      "Meiryo",
      '"メイリオ"',
      '"MS PGothic"',
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: "700",
      "@media screen and (max-width: 600px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: "600",
      "@media screen and (max-width: 600px)": {
        fontSize: "1.5rem",
      },
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: "600",
      "@media screen and (max-width: 600px)": {
        fontSize: "1.25rem",
      },
    },
    h4: {
      fontSize: "1.15rem",
      fontWeight: "600",
      "@media screen and (max-width: 600px)": {
        fontSize: "1.1rem",
      },
    },
  },
  palette: {
    primary: {
      light: "#69a1ff",
      main: "#1a73e8",
      dark: "#1765cc",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffff83",
      main: "#fce850",
      dark: "#fba834",
      contrastText: "#000",
      divider: "rgba(255, 255, 255, 0.12)",
    },
    icon: {
      light: "#8c9096",
      main: "#5f6368",
      dark: "#35393e",
    },
    text: {
      dark: "rgba(0,0,0,0.9)",
      primary: "rgba(0,0,0,0.75)",
      light: "rgba(255,255,255, 0.9)",
      lightDisabled: "rgba(255,255,255, 0.45)",
    },
    hover: {
      white: "#f5f5f5",
      light_10: "rgba(255, 255, 255, 0.1)",
      light_20: "rgba(255, 255, 255, 0.2)",
      light_30: "rgba(255, 255, 255, 0.3)",
      dark_50: "rgba(0,0,0,0.5)",
      dark_60: "rgba(0,0,0,0.6)",
      dark_70: "rgba(0,0,0,0.7)",
    },
    background: {
      loading: "rgba(255,255,255,0.7)",
      default: "#fafafa",
    },
    error: {
      main: "#d32f2f",
    },
  },
  transition: {
    default: "all .2s ease",
    short: "all .1s ease",
  },
  zIndex: {
    loading: 1600,
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: 14,
      },
    },
    MuiTabs: {
      root: {
        minHeight: "40px",
      },
    },
    MuiTab: {
      root: {
        minHeight: "40px",
      },
    },
    MuiAvatar: {
      root: {
        width: "36px",
        height: "36px",
      },
    },
    MuiIconButton: {
      root: {
        padding: "8px",
        "@media screen and (max-width: 600px)": {
          padding: "6px",
        },
      },
    },
    MuiFormControlLabel: {
      labelPlacementStart: {
        marginRight: "0",
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "#f3f3f6",
        "&:hover": {
          backgroundColor: "#f3f3f6!important",
        },
        "&.Mui-focused": {
          backgroundColor: "#f3f3f6!important",
        },
      },
    },
    MuiCardHeader: {
      subheader: {
        fontSize: "14px",
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: "15px",
      },
      elevation1: {
        boxShadow:
          "0px 1px 2px 0px rgba(60,64,67,0.3), 0px 1px 3px 1px rgba(60,64,67,0.15)",
      },
    },
    MuiSnackbarContent: {
      root: {
        flexWrap: "nowrap",
      },
      action: {
        paddingLeft: "0",
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: "40px",
      },
    },
    MuiSelect: {
      outlined: {
        "&:focus": {
          backgroundColor: "rgba(0,0,0,0)",
        },
      },
    },
    MuiAlert: {
      standardInfo: {
        color: "rgb(27, 58, 87)",
        backgroundColor: "rgb(229, 234, 240)",
        "&& $icon": {
          color: "rgb(27, 58, 87)",
        },
      },
      standardError: {
        color: "rgb(198, 40, 40)",
        backgroundColor: "rgb(251, 233, 231);",
        "&& $icon": {
          color: "rgb(211, 47, 47)",
        },
      },
    },
    MuiDialogContentText: {
      root: {
        marginBottom: "16px",
      },
    },
    MuiPickersDay: {
      current: {
        backgroundColor: "rgba(26, 115, 232, 0.1)",
        color: "#1765cc",
      },
    },
    MuiButton: {
      root: {
        borderRadius: "20px",
        textTransform: "none",
      },
      text: {
        "&&$fullWidth": {
          borderRadius: "0",
        },
      },
    },
  },
  props: {
    MuiTooltip: {
      arrow: true,
      placement: "bottom",
    },
    MuiContainer: {
      disableGutters: true,
    },
    MuiButton: {
      disableElevation: true,
    },
  },
});
