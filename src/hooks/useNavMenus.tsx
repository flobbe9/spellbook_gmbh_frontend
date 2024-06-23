import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WPNavMenu } from "../abstract/WPNavMenu";
import { useEffect, useState } from "react";
import { WORDPRESS_BASE_URL, WORDPRESS_REQUEST_MAPPING } from "../helpers/constants";
import { fetchAny, isHttpStatusCodeAlright } from "../helpers/fetchUtils";


/**
 * @returns array of all nav menus
 * @since 0.0.2
 */
export default function useNavMenus(): WPNavMenu[] {

    const [navMenus, setNavMenus] = useState<WPNavMenu[]>([]);

    const QUERY_KEY = ["navMenus"]

    const queryClient = useQueryClient();

    const { data } = useQuery<WPNavMenu[]>({
        queryKey: QUERY_KEY,
        queryFn: fetchNavMenus,
        initialData: queryClient.getQueryData(QUERY_KEY)
    });


    useEffect(() => {
        if (data)
            setNavMenus(data);

    }, [data]);


    async function fetchNavMenus(): Promise<WPNavMenu[]> {

        const url = `${WORDPRESS_BASE_URL}/${WORDPRESS_REQUEST_MAPPING}/custom/menus`;

        const response = await fetchAny(url);

        if (!isHttpStatusCodeAlright(response.status))
            return [];

        return await (response as Response).json();
    }


    return navMenus;
}