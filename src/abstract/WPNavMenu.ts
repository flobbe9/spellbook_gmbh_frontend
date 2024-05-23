import { WPNavMenuItem } from './WPNavMenuItem';


/**
 * @since 0.0.2
 */
export class WPNavMenu {

    term_id: number;

    /** Will be displayed as label to click on */
    name: string;

    items: WPNavMenuItem[];


    public static getDefaultInstance(): WPNavMenu {

        return {
            term_id: 0,
            name: "",
            items: []
        }
    }
}