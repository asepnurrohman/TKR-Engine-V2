/**
 * ============================================================
 * TKR ENGINE V2
 * ------------------------------------------------------------
 * File        : Storage.js
 * Module      : Core
 * Description : Universal Storage Manager
 * Version     : 0.2.0-alpha
 * Author      : Asep + ChatGPT
 * License     : MIT
 * ============================================================
 */

"use strict";

/* ============================================================
 * STORAGE CONSTANT
 * ============================================================
 */

const STORAGE_VERSION = "0.2.0-alpha";

const STORAGE_PREFIX = "TKR_ENGINE";

const STORAGE_PROVIDERS = {

    MEMORY: "memory",

    LOCAL: "local",

    SESSION: "session",

    GAS: "gas"

};

/* ============================================================
 * ABSTRACT PROVIDER
 * ============================================================
 */

class StorageProvider {

    constructor(name) {

        this.name = name;

    }

    get(key){

        throw new Error("get() must be implemented.");

    }

    set(key,value){

        throw new Error("set() must be implemented.");

    }

    remove(key){

        throw new Error("remove() must be implemented.");

    }

    clear(){

        throw new Error("clear() must be implemented.");

    }

    has(key){

        throw new Error("has() must be implemented.");

    }

    keys(){

        return [];

    }

    values(){

        return [];

    }

    entries(){

        return [];

    }

    export(){

        return {};

    }

    import(){

        return true;

    }

}

/* ============================================================
 * MEMORY PROVIDER
 * ============================================================
 */

class MemoryProvider extends StorageProvider{

    constructor(){

        super(STORAGE_PROVIDERS.MEMORY);

        this.storage={};

    }

    get(key){

        return Utils.resolve(

            this.storage,

            key

        );

    }

    set(key,value){

        Utils.set(

            this.storage,

            key,

            Utils.clone(value)

        );

        return true;

    }

    remove(key){

        return Utils.remove(

            this.storage,

            key

        );

    }

    clear(){

        this.storage={};

        return true;

    }

    has(key){

        return Utils.has(

            this.storage,

            key

        );

    }

    keys(){

        return Object.keys(

            this.storage

        );

    }

    values(){

        return Object.values(

            this.storage

        );

    }

    entries(){

        return Object.entries(

            this.storage

        );

    }

    export(){

        return Utils.clone(

            this.storage

        );

    }

    import(data={}){

        this.storage=

            Utils.clone(data);

        return true;

    }

}

/* ============================================================
 * LOCAL STORAGE PROVIDER
 * ============================================================
 */

class LocalStorageProvider extends StorageProvider{

    constructor(prefix=STORAGE_PREFIX){

        super(STORAGE_PROVIDERS.LOCAL);

        this.prefix=prefix;

    }

    makeKey(key){

        return `${this.prefix}:${key}`;

    }

    get(key){

        const value=

            localStorage.getItem(

                this.makeKey(key)

            );

        if(value===null){

            return undefined;

        }

        return JSON.parse(value);

    }

    set(key,value){

        localStorage.setItem(

            this.makeKey(key),

            JSON.stringify(value)

        );

        return true;

    }

    remove(key){

        localStorage.removeItem(

            this.makeKey(key)

        );

        return true;

    }
      clear(){

        Object.keys(localStorage).forEach(key=>{

            if(

                key.startsWith(

                    this.prefix + ":"

                )

            ){

                localStorage.removeItem(key);

            }

        });

        return true;

    }

    has(key){

        return localStorage.getItem(

            this.makeKey(key)

        ) !== null;

    }

    keys(){

        const result=[];

        Object.keys(localStorage).forEach(key=>{

            if(

                key.startsWith(

                    this.prefix + ":"

                )

            ){

                result.push(

                    key.replace(

                        this.prefix + ":",

                        ""

                    )

                );

            }

        });

        return result;

    }

    values(){

        return this.keys().map(key=>

            this.get(key)

        );

    }

    entries(){

        return this.keys().map(key=>[

            key,

            this.get(key)

        ]);

    }

    export(){

        const data={};

        this.entries().forEach(item=>{

            data[item[0]]=item[1];

        });

        return data;

    }

    import(data={}){

        this.clear();

        Object.entries(data).forEach(item=>{

            this.set(

                item[0],

                item[1]

            );

        });

        return true;

    }

}

/* ============================================================
 * SESSION STORAGE PROVIDER
 * ============================================================
 */

class SessionStorageProvider extends StorageProvider{

    constructor(prefix=STORAGE_PREFIX){

        super(STORAGE_PROVIDERS.SESSION);

        this.prefix=prefix;

    }

    makeKey(key){

        return `${this.prefix}:${key}`;

    }

    get(key){

        const value=sessionStorage.getItem(

            this.makeKey(key)

        );

        if(value===null){

            return undefined;

        }

        return JSON.parse(value);

    }

    set(key,value){

        sessionStorage.setItem(

            this.makeKey(key),

            JSON.stringify(value)

        );

        return true;

    }

    remove(key){

        sessionStorage.removeItem(

            this.makeKey(key)

        );

        return true;

    }

    clear(){

        Object.keys(sessionStorage).forEach(key=>{

            if(

                key.startsWith(

                    this.prefix + ":"

                )

            ){

                sessionStorage.removeItem(key);

            }

        });

        return true;

    }

    has(key){

        return sessionStorage.getItem(

            this.makeKey(key)

        ) !== null;

    }

    keys(){

        const result=[];

        Object.keys(sessionStorage).forEach(key=>{

            if(

                key.startsWith(

                    this.prefix + ":"

                )

            ){

                result.push(

                    key.replace(

                        this.prefix + ":",

                        ""

                    )

                );

            }

        });

        return result;

    }

    values(){

        return this.keys().map(key=>

            this.get(key)

        );

    }

    entries(){

        return this.keys().map(key=>[

            key,

            this.get(key)

        ]);

    }

    export(){

        const data={};

        this.entries().forEach(item=>{

            data[item[0]]=item[1];

        });

        return data;

    }

    import(data={}){

        this.clear();

        Object.entries(data).forEach(item=>{

            this.set(

                item[0],

                item[1]

            );

        });

        return true;

    }

}

/* ============================================================
 * GOOGLE APPS SCRIPT PROVIDER
 * ============================================================
 */

class GASStorageProvider extends StorageProvider{

    constructor(){

        super(STORAGE_PROVIDERS.GAS);

    }

    async get(key){

        throw new Error(

            "GASStorageProvider belum diimplementasikan."

        );

    }

    async set(key,value){

        throw new Error(

            "GASStorageProvider belum diimplementasikan."

        );

    }

    async remove(key){

        throw new Error(

            "GASStorageProvider belum diimplementasikan."

        );

    }

    async clear(){

        throw new Error(

            "GASStorageProvider belum diimplementasikan."

        );

    }

    async has(key){

        throw new Error(

            "GASStorageProvider belum diimplementasikan."

        );

    }

}

/* ============================================================
 * STORAGE MANAGER
 * ============================================================
 */

class StorageManager{

    constructor(){

        this._providers=new Map();

        this._provider=null;

        this.register(

            STORAGE_PROVIDERS.MEMORY,

            new MemoryProvider()

        );

        this.register(

            STORAGE_PROVIDERS.LOCAL,

            new LocalStorageProvider()

        );

        this.register(

            STORAGE_PROVIDERS.SESSION,

            new SessionStorageProvider()

        );

        this.register(

            STORAGE_PROVIDERS.GAS,

            new GASStorageProvider()

        );

        this.use(

            STORAGE_PROVIDERS.MEMORY

        );

    }
      /* ============================================================
     * PROVIDER REGISTRY
     * ============================================================
     */

    register(name, provider){

        if(!(provider instanceof StorageProvider)){

            throw new Error(

                `Provider '${name}' harus turunan StorageProvider.`

            );

        }

        this._providers.set(

            name,

            provider

        );

        return this;

    }

    unregister(name){

        this._providers.delete(name);

        return this;

    }

    use(name){

        if(

            !this._providers.has(name)

        ){

            throw new Error(

                `Storage provider '${name}' tidak ditemukan.`

            );

        }

        this._provider=

            this._providers.get(name);

        if(

            typeof Engine!=="undefined" &&

            Engine.emit

        ){

            Engine.emit(

                "storage:provider",

                {

                    provider:name

                }

            );

        }

        return this;

    }

    provider(){

        return this._provider;

    }

    providers(){

        return Array.from(

            this._providers.keys()

        );

    }

    /* ============================================================
     * BASIC CRUD
     * ============================================================
     */

    get(key,defaultValue=null){

        const value=

            this._provider.get(key);

        return value===undefined

            ? defaultValue

            : value;

    }

    set(key,value){

        const result=

            this._provider.set(

                key,

                value

            );

        if(

            typeof Engine!=="undefined" &&

            Engine.emit

        ){

            Engine.emit(

    "storage:set",

    StorageManager.createEvent(

        "set",

        key,

        value

    )

);

        }

        return result;

    }

    remove(key){

        const result=

            this._provider.remove(

                key

            );

        if(

            typeof Engine!=="undefined" &&

            Engine.emit

        ){

            Engine.emit(

                "storage:remove",

                StorageManager.createEvent(

    "remove",

    key

)

            );

        }

        return result;

    }

    clear(){

        const result=

            this._provider.clear();

        if(

            typeof Engine!=="undefined" &&

            Engine.emit

        ){

            Engine.emit(

                "storage:clear",
StorageManager.createEvent(

    "clear"

)
            );

        }

        return result;

    }

    has(key){

        return this._provider.has(key);

    }

    /* ============================================================
     * COLLECTION
     * ============================================================
     */

    keys(){

        return this._provider.keys();

    }

    values(){

        return this._provider.values();

    }

    entries(){

        return this._provider.entries();

    }

    size(){

        return this.keys().length;

    }

    isEmpty(){

        return this.size()===0;

    }

    /* ============================================================
     * IMPORT EXPORT
     * ============================================================
     */

    export(){

        return this._provider.export();

    }

    import(data){

        const result=

            this._provider.import(data);

        if(

            typeof Engine!=="undefined" &&

            Engine.emit

        ){

            Engine.emit(

                "storage:import",

                StorageManager.createEvent(

    "import",

    null,

    data

)

            );

        }

        return result;

    }

    backup(){

        return {

            version:STORAGE_VERSION,

            provider:this.provider().name,

            timestamp:Date.now(),

            data:this.export()

        };

    }

    restore(backup){

        if(

            !backup ||

            !backup.data

        ){

            throw new Error(

                "Backup tidak valid."

            );

        }

        return this.import(

            backup.data

        );

    }
      /* ============================================================
     * TRANSACTION
     * ============================================================
     */

    transaction(callback){

        if(typeof callback!=="function"){

            throw new TypeError(

                "Transaction membutuhkan callback."

            );

        }

        const before=this.export();

        callback(this);

        const after=this.export();

        if(

            typeof Engine!=="undefined" &&

            Engine.emit

        ){

            Engine.emit(

                "storage:transaction",

                {

                    before,

                    after

                }

            );

        }

        return this;

    }

    /* ============================================================
     * SYNC
     * ============================================================
     */

    async sync(){

        if(

            typeof this._provider.sync === "function"

        ){

            const result=

                await this._provider.sync();

            if(

                typeof Engine!=="undefined" &&

                Engine.emit

            ){

                Engine.emit(

                    "storage:sync",

                    result

                );

            }

            return result;

        }

        return false;

    }

    /* ============================================================
     * RESET
     * ============================================================
     */

    reset(){

        this.clear();

        return this.use(

            STORAGE_PROVIDERS.MEMORY

        );

    }

    /* ============================================================
     * INFORMATION
     * ============================================================
     */

    info(){

        return {

            version:STORAGE_VERSION,

            provider:this.provider().name,

            providers:this.providers(),

            size:this.size(),

            timestamp:Date.now()

        };

    }

    toJSON(){

        return this.export();

    }

    toString(){

        return JSON.stringify(

            this.export(),

            null,

            2

        );

    }

}

/* ============================================================
 * SINGLETON
 * ============================================================
 */

Engine.storage = new StorageManager();

/* ============================================================
 * ENGINE SHORTCUT
 * ============================================================
 */

Engine.store = Engine.storage;

Engine.save = function(key,value){

    return Engine.storage.set(

        key,

        value

    );

};

Engine.load = function(key,defaultValue=null){

    return Engine.storage.get(

        key,

        defaultValue

    );

};

Engine.delete = function(key){

    return Engine.storage.remove(

        key

    );

};

Engine.backup = function(){

    return Engine.storage.backup();

};

Engine.restore = function(data){

    return Engine.storage.restore(

        data

    );

};

/* ============================================================
 * VERSION
 * ============================================================
 */

StorageManager.VERSION = STORAGE_VERSION;

/* ============================================================
 * FREEZE
 * ============================================================
 */

Object.freeze(StorageProvider);

Object.freeze(MemoryProvider);

Object.freeze(LocalStorageProvider);

Object.freeze(SessionStorageProvider);

Object.freeze(GASStorageProvider);

/* ============================================================
 * EXPORT
 * ============================================================
 */

if(typeof module!=="undefined"){

    module.exports={

        StorageProvider,

        MemoryProvider,

        LocalStorageProvider,

        SessionStorageProvider,

        GASStorageProvider,

        StorageManager

    };

}
/* ============================================================
 * ENVIRONMENT
 * ============================================================
 */

StorageManager.isBrowser = function () {

    return (

        typeof window !== "undefined"

    );

};

StorageManager.hasLocalStorage = function () {

    return (

        typeof window !== "undefined" &&

        typeof window.localStorage !== "undefined"

    );

};

StorageManager.hasSessionStorage = function () {

    return (

        typeof window !== "undefined" &&

        typeof window.sessionStorage !== "undefined"

    );

};

StorageManager.isGoogleAppsScript = function () {

    return (

        typeof google !== "undefined" &&

        typeof google.script !== "undefined"

    );

};

/* ============================================================
 * EVENT PAYLOAD
 * ============================================================
 */

StorageManager.createEvent = function (

    action,

    key = null,

    value = null

) {

    return {

        action,

        provider:

            Engine.storage.provider().name,

        key,

        value,

        timestamp: Date.now()

    };

};

/* ============================================================
 * VALIDATION
 * ============================================================
 */

StorageManager.validateKey = function (key) {

    if (typeof key !== "string") {

        throw new TypeError(

            "Storage key harus berupa String."

        );

    }

    if (key.trim() === "") {

        throw new Error(

            "Storage key tidak boleh kosong."

        );

    }

};

StorageManager.validateProvider = function (provider) {

    if (!(provider instanceof StorageProvider)) {

        throw new Error(

            "Provider tidak valid."

        );

    }

};

/* ============================================================
 * DEFAULT PROVIDER
 * ============================================================
 */

if (

    StorageManager.hasLocalStorage()

) {

    Engine.storage.use(

        STORAGE_PROVIDERS.LOCAL

    );

} else {

    Engine.storage.use(

        STORAGE_PROVIDERS.MEMORY

    );

}

/* ============================================================
 * READY
 * ============================================================
 */

if (

    typeof Engine !== "undefined" &&

    Engine.emit

) {

    Engine.emit(

        "storage:ready",

        {

            provider:

                Engine.storage.provider().name,

            version:

                STORAGE_VERSION

        }

    );

}
  
