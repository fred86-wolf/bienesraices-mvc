import {Dropzone} from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.image = {
    dictDefaultMessage:'Arrastra tus Imagenes aqui',
    acceptedFiles:'.png,.jpg,.jpeg',
    maxFilesize:5,
    maxFiles:1,
    paralleUploads:1,
    autoProcessQueue:false,
    addRemoveLinks:true,
    dictRemoveFile:'Borrar Archivo',
    dictMaxFilesExceeded:'El limite es 1 archivo',
    headers:{
        'CSRF-Token':token
    },
    paramName:'image',
    init:function(){
        const dropzone = this
        const btnPosted = document.querySelector('#posted')

        btnPosted.addEventListener('click',function(){
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete',function(){
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/your-properties'
            }
        })
    }

}