$(function()
{
    $('#idForm').submit(function(){
        $("input[type='submit']", this)
        .val("Generation en cours...")
        .attr('disabled', 'disabled');
    return true;
  });
});