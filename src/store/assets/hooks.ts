import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchAssets, updateUserAssets } from "./thunks";
import {
    selectAssets,
    selectUserAssets,
    selectAssetsLoading,
    selectAssetsError,
} from "./selectors";

export const useAssets = () => {
    const dispatch = useDispatch<AppDispatch>();

    const assets = useSelector(selectAssets);
    const userAssets = useSelector(selectUserAssets);
    const loading = useSelector(selectAssetsLoading);
    const error = useSelector(selectAssetsError);

    const loadAssets = () => dispatch(fetchAssets());
    const updateUserAssetsList = (address: string) =>
        dispatch(updateUserAssets(address));

    return {
        assets,
        userAssets,
        loading,
        error,
        loadAssets,
        updateUserAssetsList,
    };
};
