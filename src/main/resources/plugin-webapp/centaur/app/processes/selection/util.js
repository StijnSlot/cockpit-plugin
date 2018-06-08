define({
    /**
     * Puts checkboxes in the process definition list
     * Uses HARDCODED jquery
     */
    putCheckboxes: function() {
        // create title
        var th = document.createElement('TH');
        th.className = "ng-binding";
        th.innerHTML = "";
        $(".process-definitions-list > thead > tr").append(th);

        // create checkboxes
        $(".process-definitions-list > tbody > tr").each(function(i) {
            //var name = $(this).children(".name").text();
            var td = document.createElement('TD');
            //td.setAttribute("ng-app", "cockpit.plugin.centaur.processes.selection");
            //td.setAttribute("ng-controller", "cockpit.plugin.centaur.processes.selection.controller");
            var box = document.createElement('INPUT');
            box.type = "checkbox";
            box.id = "processSelect" + i;
            //box.setAttribute("ng-model", "pd.checked");
            //box.setAttribute("ng-change", "processSelect(pd)");
            td.appendChild(box);
            $(this).append(td);
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
     * Gets the selected ids from the process definitions list
     *
     * @returns {Array}     of process definition ids that are selected
     */
    getSelectedIds: function() {
        var out = [];

        $(".process-definitions-list > tbody > tr").each(function() {
            if($(this).find('input').is(':checked')) {
                var link = $(this).find('.name > a').prop("href");
                var id = link.split('/').pop();
                console.log(id);
                if(id !== undefined) out.push(id);
            }
        });

        return out;
    },

    /**
     * delete the process definition ids in the camunda database
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
    }
});