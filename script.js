$(document).ready(function () {
    // Initialize tabs
    $("#tableTabs").tabs({
        activate: function(event, ui) {
        }
    });
    function initializeSlider(inputId, sliderId, min, max) {
        const $input = $(`#${inputId}`);
        const $slider = $(`#${sliderId}`);

        $slider.slider({
            min: -50,
            max: 50,
            value: 0,
            slide: function(event, ui) {
                $input.val(ui.value);
            }
        });

        $input.on('change input', function() {
            let val = parseInt($(this).val()) || 0;
            val = Math.max(-50, Math.min(50, val));
            $slider.slider('value', val);
            $(this).val(val);
        });

        $input.val($slider.slider('value'));
    }

    initializeSlider('multiplierStart', 'multiplierStartSlider');
    initializeSlider('multiplierEnd', 'multiplierEndSlider');
    initializeSlider('multiplicandStart', 'multiplicandStartSlider');
    initializeSlider('multiplicandEnd', 'multiplicandEndSlider');

    $("#tableForm").validate({
        rules: {
            multiplierStart: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            multiplierEnd: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            multiplicandStart: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            multiplicandEnd: {
                required: true,
                number: true,
                min: -50,
                max: 50
            }
        },
        messages: {
            multiplierStart: {
                required: "Minimum Row Value is required.",
                number: "Please enter a valid number.",
                min: "Value must be >= -50.",
                max: "Value must be <= 50."
            },
            multiplierEnd: {
                required: "Maximum Row Value is required.",
                number: "Please enter a valid number.",
                min: "Value must be >= -50.",
                max: "Value must be <= 50."
            },
            multiplicandStart: {
                required: "Minimum Column Value is required.",
                number: "Please enter a valid number.",
                min: "Value must be >= -50.",
                max: "Value must be <= 50."
            },
            multiplicandEnd: {
                required: "Maximum Column Value is required.",
                number: "Please enter a valid number.",
                min: "Value must be >= -50.",
                max: "Value must be <= 50."
            }
        },
        errorPlacement: function (error, element) {
            error.addClass("error-message");
            error.insertAfter(element);
        },
        submitHandler: function () {
            generateTable();
        }
    });

    function generateTable() {
        const multiplierStart = parseInt($("#multiplierStart").val());
        const multiplierEnd = parseInt($("#multiplierEnd").val());
        const multiplicandStart = parseInt($("#multiplicandStart").val());
        const multiplicandEnd = parseInt($("#multiplicandEnd").val());

        if (multiplierEnd < multiplierStart || multiplicandEnd < multiplicandStart) {
            $("#errorMessage").text("Ensure start values are less than or equal to end values.").show();
            return;
        }

        // Create new tab for this table
        const tabId = `table-${Date.now()}`;
        const tabLabel = `${multiplierStart} to ${multiplierEnd}, ${multiplicandStart} to ${multiplicandEnd}`;
        
        $("#tableTabs ul").append(
            `<li>
                <a href="#${tabId}">${tabLabel}</a>
                <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span>
            </li>`
        );
        
        $("#tableTabs").append(`<div id="${tabId}"></div>`);
        $("#tableTabs").tabs("refresh");
        $("#tableTabs").tabs("option", "active", -1);

        const $table = $("<table>").attr("id", `multiplicationTable-${tabId}`);
        const headerRow = $("<tr>");
        headerRow.append($("<th>").addClass("corner-cell"));
        
        for (let j = multiplicandStart; j <= multiplicandEnd; j++) {
            headerRow.append($("<th>").text(j));
        }
        $table.append(headerRow);

        for (let i = multiplierStart; i <= multiplierEnd; i++) {
            const row = $("<tr>");
            row.append($("<th>").text(i));
            for (let j = multiplicandStart; j <= multiplicandEnd; j++) {
                row.append($("<td>").text(i * j));
            }
            $table.append(row);
        }

        $(`#${tabId}`).append($table);
        $("#errorMessage").hide();
    }

    // Tab deletion
    $("#tableTabs").on("click", "span.ui-icon-close", function() {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $(`#${panelId}`).remove();
        $("#tableTabs").tabs("refresh");
    });
});