import * as React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import {  ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  DayView,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentForm,
  AppointmentTooltip,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";

const PREFIX = "Demo";

const classes = {
  toolbarRoot: `${PREFIX}-toolbarRoot`,
  progress: `${PREFIX}-progress`,
};

const StyledDiv = styled("div")({
  [`&.${classes.toolbarRoot}`]: {
    position: "relative",
  },
});

const StyledLinearProgress = styled(LinearProgress)(() => ({
  [`&.${classes.progress}`]: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
  },
}));

// const PUBLIC_KEY = 'AIzaSyBnNAISIUKe6xdhq1_rjor2rxoI3UlMY7k';
// const CALENDAR_ID = 'f7jnetm22dsjc3npc2lu3buvu4@group.calendar.google.com';

const getData = (setData, setLoading) => {
  const dataUrl = ["https://62d8f5b2908831393597b00b.mockapi.io/api/events"];
  setLoading(true);

  return fetch(dataUrl)
    .then((response) => response.json())
    .then((res) => {
      setTimeout(() => {
        setData(res);
        setLoading(false);
      }, 600);
    });
};

const ToolbarWithLoading = ({ children, ...restProps }) => (
  <StyledDiv className={classes.toolbarRoot}>
    <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
    <StyledLinearProgress className={classes.progress} />
  </StyledDiv>
);

const mapAppointmentData = (appointment) => ({
  id: appointment.id,
  startDate: appointment.startDate,
  endDate: appointment.endDate,
  title: appointment.title,
});

const initialState = {
  data: [],
  loading: false,
  currentDate: "2022-07-11",
  currentViewName: "Week",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setData":
      return { ...state, data: action.payload.map(mapAppointmentData)};
    case "setCurrentViewName":
      return { ...state, currentViewName: action.payload };
    case "setCurrentDate":
      return { ...state, currentDate: action.payload };
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { data, loading, currentViewName, currentDate } = state;
  const setCurrentViewName = React.useCallback(
    (nextViewName) =>
      dispatch({
        type: "setCurrentViewName",
        payload: nextViewName,
      }),
    [dispatch]
  );
  const setData = React.useCallback(
    (nextData) =>
      dispatch({
        type: "setData",
        payload: nextData,
      }),
    [dispatch]
  );
  const setCurrentDate = React.useCallback(
    (nextDate) =>
      dispatch({
        type: "setCurrentDate",
        payload: nextDate,
      }),
    [dispatch]
  );
  const setLoading = React.useCallback(
    (nextLoading) =>
      dispatch({
        type: "setLoading",
        payload: nextLoading,
      }),
    [dispatch]
  );

  React.useEffect(() => {
    getData(setData, setLoading);
  }, [setData, currentViewName, currentDate]);

  return (
      <Scheduler data={data} height={660}>
        <ViewState
          currentDate={currentDate}
          currentViewName={currentViewName}
          onCurrentViewNameChange={setCurrentViewName}
          onCurrentDateChange={setCurrentDate}
        />
        <DayView startDayHour={8.5} endDayHour={18.5} />
        <WeekView startDayHour={8.5} endDayHour={18.5} />
        <MonthView />
        <Appointments />
        <Toolbar
          {...(loading ? { rootComponent: ToolbarWithLoading } : null)}
        />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <AppointmentTooltip showOpenButton showCloseButton />
        <AppointmentForm readOnly />
      </Scheduler>
  );
};
