define({
    /**
     * Gets the selected ids from the process definitions list.
     *
     * @param   {String}        selector    A jQuery selector string for finding the checkboxes.
     * @returns {Array<String>}             The process definition ids that are selected.
     */
    getSelectedRows: function(selector) {
        var out = [];

        $(selector).each(function() {
            if($(this).find('input').is(':checked')) {
                out.push($(this));
            }
        });

        return out;
    }
});