define({
    /**
     * Puts checkboxes in the process definition list
     * Uses HARDCODED jquery
     */
    putCheckboxes: function() {
        // create title
        var th = document.createElement('TH');
        th.innerHTML = "";
        $(".process-definitions-list > thead > tr").prepend(th);

        // create checkboxes
        $(".process-definitions-list > tbody > tr").each(function(i) {
            var td = document.createElement('TD');
            var box = document.createElement('INPUT');
            box.type = "checkbox";
            box.id = "processSelect" + i;
            td.appendChild(box);
            $(this).prepend(td);
        });
    },

    /**
     * Create delete button underneath process definition list
     * Uses HARDCODED jquery
     *
     * @returns {HTMLElement}
     */
    putDeleteButton: function() {
        var button = document.createElement("BUTTON");
        button.classList.add("delete-process-button", "btn");
        button.innerText = "Delete";

        // manual jquery insertion
        $(".loader-state").append(button);

        return button;
    },

    /**
     * delete the process definition ids in the camunda database and reload page
     *
     * @param {Object}  $http   http object to make requests
     * @param {Object}  $q      angular object for making promises
     * @param {Object}  Uri     Uri to create HTTP string
     * @param {Array}   ids     process definition ids
     */
    deleteProcessDefinition: function($http, $q, Uri, ids) {
        var requestArr = [];
        ids.forEach(function(id) {
            requestArr.push($http.delete(Uri.appUri("engine://engine/:engine/process-definition/" + id + "?cascade=true")));
        });

        $q.all(requestArr).then(function() {
            window.location.reload();
        });
    },

    /**
     * Gets ids from jquery rows
     *
     * @param rows      jquery object containing multiple html rows
     * @return {Array}
     */
    getSelectedIds: function(rows) {
        var out = [];

        $(rows).each(function() {
            var link = $(this).find('.name > a').prop("href");
            if(link !== undefined) {
                var id = link.split('/').pop();
                out.push(id);
            }
        });

        return out;
    }
});