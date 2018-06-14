define({
    /**
     * Gets the selected ids from the process definitions list
     *
     * @param   selector    a jquery selector string for finding the checkboxes
     * @returns {Array}     of process definition ids that are selected
     */
    getSelectedRows: function(selector) {
        var out = [];

        $(selector).each(function() {
            console.log("hi");
            if($(this).find('input').is(':checked')) {
                out.push($(this));
            }
        });

        return out;
    }
});