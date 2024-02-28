// src/context/ClientEventsContext.js
import React, { createContext, useContext, useEffect } from 'react';
//@ts-ignore
const log = require('@pioneer-platform/loggerdog')();
//@ts-ignore
import Events from "@pioneer-platform/pioneer-events"; // ES6 import

// Initialize your clientEvents instance
const clientEvents = new Events();

const ClientEventsContext = createContext();

export const useClientEvents = () => useContext(ClientEventsContext);

export const ClientEventsProvider = ({ children }) => {
    useEffect(() => {
        const handleEvent = async (event) => {
            let tag = "TAG | events | "; // Adjust TAG to your actual tag value
            try {
                event = JSON.parse(event);
                log.info(tag, "event: ", event);

                if (event && event.type == "match") {
                    log.info(tag, "event: ", event);
                }
            } catch (e) {
                log.error(e);
            }
        };

        clientEvents.events.on('message', handleEvent);

        return () => {
            clientEvents.events.off('message', handleEvent);
        };
    }, []);

    return <ClientEventsContext.Provider value={{}}>
        {children}
    </ClientEventsContext.Provider>;
};
