export function isFileSizeNotAllowed(fileSize,allowedSize){
    if(fileSize < 1024*1024){
      return false
    }
    else{
      let sizeInMB=(parseInt(fileSize)/1024/1024).toFixed(2);

      if(sizeInMB > allowedSize){
        return true;
      }
      else{
        return false
      }
    }
 
  
}