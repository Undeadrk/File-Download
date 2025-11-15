import {defineStore} from 'pinia'

export const useFileStore = defineStore('file',{
    state:()=>({
        tempDir: "",

        
    }),
    actions:{
        setTempDir(tempDir){
            this.tempDir = tempDir
        },
    }
})
