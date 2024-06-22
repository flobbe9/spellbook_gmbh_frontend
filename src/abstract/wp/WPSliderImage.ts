import { PROTOCOL, isImage } from "../../helpers/constants";
import { isBlank, log } from "../../helpers/genericUtils";
import WPBlockAttribute from './WPBlockAttribute';


/**
 * Definition of the data of one Image in an ImageSlider (see {@link WPBlockAttribute} "data").
 * 
 * @since 0.0.2
 */
export class WPSliderImage {

    /** Url of the image */
    image: string;

    /** Link to wrap the image in */
    link: string;

    /** If true, set target="_blank" */
    open_in_new_tab: boolean;
}


/** The object key of an image slider (access like ```data[IMAGE_SLIDER_DATA_KEY]```) */
export const IMAGE_SLIDER_DATA_KEY = "image_slider";


/**
 * @param data object from {@link WPBlockAttribute} passed to an ImageSlider
 * @returns an array with either a WPSliderImage or undefined if image url invalid. Return ```[]``` if ```data``` is falsy
 */
export function mapDataToSliderImages(data: object | undefined): (WPSliderImage | undefined)[] {

    if (!data || !data[IMAGE_SLIDER_DATA_KEY])
        return [];

    return data[IMAGE_SLIDER_DATA_KEY].map(image => {
        const wpSliderImage = image as WPSliderImage;

        // dont map if image url invalid
        if (!isImageUrlValid(wpSliderImage.image))
            return;
        
        return wpSliderImage;
    });
}


export function isImageSliderEmpty(data): boolean {

    if (!data || !data[IMAGE_SLIDER_DATA_KEY])
        return true;

    return data[IMAGE_SLIDER_DATA_KEY].length === 0;
}



/**
 * @param url of image to validate
 * @returns true if url is not falsy or blank and starts with {@link PROTOCOL}
 */
function isImageUrlValid(url: string): boolean {

    if (typeof url !== "string")
        return false;

    // case: falsy url
    if (isBlank(url))
        return false;

    // case: not a valid url
    if (!url.startsWith(PROTOCOL))
        return false;

    // case: not an image
    if (!isImage(url))
        return false;

    return true;
}