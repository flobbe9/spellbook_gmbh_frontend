import { assertFalsyOrBlankAndThrow, getTimeStamp, isBlank } from "@/helpers/utils";

/**
 * Interface defining the format of an http response object.
 * 
 * @since latest
 */
export class CustomResponseFormat {
    status: number;

    timestamp: string;

    message?: string;

    path: string;

    /**
     * Use {@link builder()} instead
     */
    private constructor() {}
    

    public static builder(): CustomResponseFormatBuilder {
        return new CustomResponseFormatBuilder(new CustomResponseFormat());
    }
}

/**
 * @since latest
 */
export class CustomResponseFormatBuilder {
    private customResponseFormat: CustomResponseFormat;

    constructor(customResponseFormat: CustomResponseFormat) {
        this.customResponseFormat = customResponseFormat;
    }

    public status(status: number): CustomResponseFormatBuilder {
        this.customResponseFormat.status = status;

        return this;
    }

    
    public message(message: string): CustomResponseFormatBuilder {
        this.customResponseFormat.message = message;

        return this;
    }

    
    public path(path: string): CustomResponseFormatBuilder {
        this.customResponseFormat.path = path;

        return this;
    }

    
    public timestamp(timestamp: string): CustomResponseFormatBuilder {
        this.customResponseFormat.timestamp = timestamp;

        return this;
    }

    public build(): CustomResponseFormat {
        assertFalsyOrBlankAndThrow(this.customResponseFormat.status);

        if (isBlank(this.customResponseFormat.timestamp))
            this.customResponseFormat.timestamp = getTimeStamp();

        if (isBlank(this.customResponseFormat.path))
            this.customResponseFormat.path = window.location.pathname;

        return this.customResponseFormat;
    }
}