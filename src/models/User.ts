import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose, { Schema } from "mongoose";

import {OpportunityType} from "./Opportunity";

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    facebook: string;
    google: string;
    tokens: AuthToken[];
    opportunitys: OpportunityType[];

    profile: {
        name: string;
        gender: string;
        location: string;
        website: string;
        picture: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };

    comparePassword: comparePasswordFunction;

    gravatar: (size: number) => string;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
type findOrCreate = (params: any, callback: (err: any, user: UserDocument) => void)  => void

export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: {type: String, select: false},
    twitter:{type: String, select: false},
    google: {type: String, select: false},
    tokens: {type: Array, select: false},

    opportunitys: [{
        type: Schema.Types.ObjectId,
        ref: "Opportunity"
    }],
    

    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String,
        coordinates: {
            lat: Number,
            lng: Number
        },
    }
}, { timestamps: true });



/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};


export type SearcParams = {
    google?: string;
    facebook?: string;
    id?: string;
    displayName?: string;
}
export const findOrCreate: findOrCreate = function(params, callback) {
    try {
        const searchParams: SearcParams = {};
        const {facebook, google, id, email, displayName} = params;
        if(facebook) {
            searchParams.facebook = facebook;
        } else if(google) {
            searchParams.google = google;
        } else {
            searchParams.id = id;
        }

        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        User.findOne(searchParams, (err, user) => {
            if(user) {
                callback(undefined, user);
            } else {
             
                /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                const newUser = new User();
                newUser.email = email;
                newUser.google = google;
                newUser.profile.name = displayName;

                newUser.save((err: Error) => {
                    callback(err, user);
                });
            }
        });
    } catch(err) {
        callback(err, undefined);
    }


};

userSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserDocument>("User", userSchema);
