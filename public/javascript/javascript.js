

const replaceStr = () => {
    $(document).ready(function() {
        $('#select').click(function() {
            $('input[type="checkbox"]:checked').each(function() {    // $(':checkbox:checked')
                var jon=document.body.append(this.value + ' ');                // $(this).val()
            });
        });
    });
    return jon
  }

  module.exports={replaceStr};





