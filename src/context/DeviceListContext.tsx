"use client"
import { createContext, ReactNode, useContext, useState } from "react";

interface DeviceInfo{
    deviceName: string;
    ipAddress: string;
}

interface DeviceListContextProps{
    devices: DeviceInfo[];
    setDevices: React.Dispatch<React.SetStateAction<DeviceInfo[]>>;
}

const DeviceListContext = createContext<DeviceListContextProps | undefined>(undefined);

export const DeviceListProvider = ({children} : {children: ReactNode}) => {
    const [devices, setDevices] = useState<DeviceInfo[]>([])

    return (
        <DeviceListContext.Provider value={{ devices, setDevices}}>
            {children}
        </DeviceListContext.Provider>
    )
};

export const useDeviceList = () => {
    const context = useContext(DeviceListContext);
    if(context === undefined){
        throw new Error("useDeviceList must be used within a DeviceListProvicer only");
    };
    return context;
}