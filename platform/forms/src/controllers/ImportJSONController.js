/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2017, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
define(
    [],
    function () {

        /**
         * Controller for the `importJSONbutton` control type. Provides
         * structure for a button (embedded via the template) which
         * EDIT THIS AND ALSO PLATFORM/EXPORTERS/EXPORTSERVICE/////////////////
         * @memberof platform/forms
         * @constructor
         * @param $scope the control's Angular scope
         * @param {DialogService} dialogService service to use to prompt
         *        for user input
         */
        function ImportJSONController($scope, dialogService) {
            this.$scope = $scope;
            this.structure = $scope.structure;

        }

        // fired on 'select file' button click
        ImportJSONController.prototype.selectFile = function () {
            var fileInput;
            var fileBody;

            // create input element if not already present
            if (!document.getElementById('file-input')) {
                fileInput = this.newInput();
            }

            // could user _.bindAll() here?
            var read = function (file) {
                return this.readFile(file);
            }.bind(this);

            var setText = function (text) {
                this.structure.text = text;
            }.bind(this);

            var validate = function (jsonString) {
                return this.validateJSON(jsonString);
            }.bind(this);

            // make sure to check IDs, file size probs
            fileInput = $(document.getElementById('file-input'));
            fileInput.value = '';

            fileInput.change(function () {
                fileInput.off('change');
                fileBody = read(this.files[0])
                    .then(function (result) {
                        try {
                            JSON.parse(result);
                        } catch (e) {
                            this.remove();
                            alert("Not a valid JSON file\n:c");
                            setText('Select File');
                            return false;
                        }
                        if (validate(result)) {
                            setText(this.files[0]['name']);
                            return true;
                        }
                        this.remove();
                        alert('JSON configuration not recognized\n:c');
                        setText('Select File');
                        return false;
                    }.bind(this));
            });
            fileInput.trigger('click');
        };

        ImportJSONController.prototype.readFile = function (file) {
            var fileReader = new FileReader();

            return new Promise(function (resolve, reject) {
                fileReader.onload = function (event) {
                    resolve(event.target.result);
                };

                fileReader.onerror = function () {
                    return reject(event.target.result);
                };
                fileReader.readAsText(file);
            })

        };

        ImportJSONController.prototype.newInput  = function () {
            var input = $(document.createElement('input'));
            input.attr("type", "file");
            input.attr("id", "file-input");
            input.attr("name", "inputControl");
            input.css("display", "none");
			//$("html").append(input);
            //input.$valid = false;
            $('body').append(input);
            //console.log(this.$scope.mctForm.$valid);
            //console.log(this.$scope.$parent.$parent.mctForm)
            //console.log(this.$scope.$parent.mctForm);
            return input;
        };

        ImportJSONController.prototype.validateJSON = function (jsonString) {
            var json = JSON.parse(jsonString);
            if (json['openmct'] && Object.keys(json).length === 1) {
                console.log("valid");
                return true;
            }
            console.log("invalid");
            return false;
        };

        return ImportJSONController;
    }
);
