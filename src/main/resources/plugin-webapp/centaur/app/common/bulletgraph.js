define({
    /**
     * This function decides which color the bullet graph should have on the following
     * conditions which are specified in the URD:
     * - Green: If the current duration is less or equal to the average and maximal duration
     * - Orange: If the current duration is less or equal to the maximal duration and greater than the average duration
     * - Red: If he current duration is greater than both the average durationa and the maximal duration
     * 
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @return  String              A string which represents the color
     */
    determineColor: function (avgDuration, maxDuration, curDuration) {
        if (curDuration <= maxDuration && curDuration <= avgDuration) {
            return 'green';
        } else if (curDuration <= maxDuration && curDuration > avgDuration) {
            return 'orange';
        } else {
            return 'red';
        }
    },

    /**
     * This function will check if the conditions to show the bulletgraph are
     * satisfied.
     *
     * The conditions to show the bulletgraph are satisfied if:
     * - Any of the duration variables are not equal to NULL
     * - The average duration is not equal to '0'.
     * - The current duration is not equal to '0'.
     *
     * @param   Number  minDuration   minimal duration of process
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @return  Boolean               if conditions are satisfied or not
     */
    checkConditions: function (minDuration, avgDuration, maxDuration, curDuration) {
        return avgDuration != null && minDuration != null && maxDuration != null && curDuration != null && avgDuration !== 0 && curDuration != 0;
    },

    /**
     * Creates an HTML line with has a class that includes the elementID. If the bulletgraph
     * is not selected to show it will hide the bulletgraph
     * 
     * @param   Object  util            object of this class, to call its functions and variables
     * @param   Object  localStorage    contains
     * @param   String  elementID       Variable to be converted.
     * @return  {object}                A string which represents an HTML line which will be added later
     */
    createHTML: function (cssClass) {
        var graph = document.createElement('DIV');
        graph.className = cssClass;
        return graph;
    },

    /**
     * This function combines all information passed into it to set the settings
     * of the bullet graph. This function is made from the code which is provided
     * on the following github: https://gist.github.com/mbostock/4061961#file-bullet-js (accesed on 29-5-2018).
     * The functions which we included are coming also from this github repository.
     * Additionally we are also using the D3 library (https://d3js.org/).
     *
     * This function adds the bulletgraph to the html class which is defined in a seperate function. 
     * The same function will be selected by using the elementID. In the data variable, the data for
     * the bulletgraph will be set. This data includes the range, the current value and the marker value.
     *
     * @param   String  elementID     ID of element
     * @param   Number  rangeBullet   range of bulletgraph
     * @param   Number  currentBullet current value of bulletgraph
     * @param   Number  markerBullet  marker value of bulletgraph
     * @param   Number  colorBullet   color of bulletgraph
     */
    setGraphSettings: function (elementID, rangeBullet, currentBullet, markerBullet, colorBullet, cssClass) {
        var newCSSClass = '.' + cssClass;
        var data = [
            {
                "ranges": [rangeBullet],
                "measures": [currentBullet, currentBullet],
                "markers": [markerBullet]
            }
        ];
        var container = d3.select(newCSSClass).node().getBoundingClientRect();
        var margin = { top: 5, right: 5, bottom: 15, left: 5 },
            width = 100 - margin.left - margin.right,
            height = 40 - margin.top - margin.bottom;

        var chart = d3.bullet(width, height)
          .width(width)
          .height(height);

        var svg = d3.select(newCSSClass).selectAll("svg")
          .data(data)
          .enter().append("svg")
          .attr("class", "bullet")
          .attr("width", 100)
          .attr("height", 40)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(chart);

        var coloring = d3.select(newCSSClass).selectAll("rect.measure.s1")
                .attr("fill", colorBullet)
    },

    /**
     * This function checks if the current duration is greater or equal to the maximal duration
     * since the bullet graph should not exceed the maximal duration.
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @return  Number                either current duration or maximal duration
     */
    checkIfCurBiggerMax: function (curDuration, maxDuration) {
        return (curDuration >= maxDuration ? maxDuration : curDuration);
    }
});