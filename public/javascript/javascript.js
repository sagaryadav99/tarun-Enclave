

const replaceStr = () => {
    $(document).ready(function() {
        $('#select').click(function() {
            $('input[type="checkbox"]:checked').each(function() {    
                var jon=document.body.append(this.value + ' ');                
            });
        });
    });
    return jon
  }

  module.exports={replaceStr};





