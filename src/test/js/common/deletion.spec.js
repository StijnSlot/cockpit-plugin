describe('Common deletion tests', function () {
    var util;

    before(function (done) {
        requirejs(['main/resources/plugin-webapp/centaur/app/common/deletion'], function (utl) {
            util = utl;
            done();
        });
    });

    it('should find common deletion util', function() {
        expect(util).to.exist;
    });

    describe('getSelectedRows tests', function() {
        var out;

        beforeEach(function() {
            // create html
            var table = document.createElement('TABLE');
            table.className = "test";
            var tbody = document.createElement('TBODY');
            var tr1 = document.createElement('TR');
            tr1.id = "correct";
            var tr2 = document.createElement('TR');
            var td1 = document.createElement('TD');
            var td2 = document.createElement('TD');
            var input1 = document.createElement('INPUT');
            input1.checked = true;
            var input2 = document.createElement('INPUT');
            input2.checked = false;

            // append html
            td1.appendChild(input1);
            td2.appendChild(input2);
            tr1.appendChild(td1);
            tr2.appendChild(td2);
            tbody.appendChild(tr1);
            tbody.appendChild(tr2);
            table.appendChild(tbody);
            document.body.append(table);

            out = util.getSelectedRows(".test > tbody > tr");
        });
        it('should return array of size 1', function() {
            expect(out).to.have.lengthOf(1);
        });
        it('should return row 1', function() {
            expect(out[0][0].id).to.eql("correct");
        });
    });
});

