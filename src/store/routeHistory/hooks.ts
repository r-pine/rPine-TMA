import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { addRoute, clearRoute, clearAllRoutes } from "./slice";
import {
    selectRouteHistory,
    selectRouteHistoryLoading,
    selectRouteHistoryError,
    selectRouteHistoryLastUpdated,
} from "./selectors";
import { RouteHistoryEntry } from "./types";

export const useRouteHistory = () => {
    const dispatch = useDispatch<AppDispatch>();

    const routes = useSelector(selectRouteHistory);
    const loading = useSelector(selectRouteHistoryLoading);
    const error = useSelector(selectRouteHistoryError);
    const lastUpdated = useSelector(selectRouteHistoryLastUpdated);

    const saveRoute = (route: RouteHistoryEntry) => dispatch(addRoute(route));
    const removeRoute = (inputAsset: string, outputAsset: string) =>
        dispatch(clearRoute({ inputAsset, outputAsset }));
    const clearHistory = () => dispatch(clearAllRoutes());

    return {
        routes,
        loading,
        error,
        lastUpdated,
        saveRoute,
        removeRoute,
        clearHistory,
    };
};
