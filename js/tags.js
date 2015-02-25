'use strict';

$(document).on('ready', function () {
    var ENTER_CODE = 13;

    //main function
    function TagCloud(node) {
        this.$node = node;
        this.tags = Array.prototype.slice.call(arguments).slice(1); //create start list of tags
        this.tags = getUnique(this.tags); //create start list of unique tags
	this.$node.find('input').val('');
        this.init();
        this.setListeners();
    }

    //create DOM for tag cloud
    TagCloud.prototype.init = function () {
        this.edit = false;
        this.$node.append($('<button>').addClass('btn btn-info edit-read-btn').attr({'type': 'button'}).text('Click and edit!'))
            .append($('<button>').addClass('btn btn-danger delete-all-btn').attr({'type': 'button'}).text('Delete all tags!').hide())
            .append($('<ul>').addClass('tag-cloud-list'))
            .append($('<div>').addClass('input-append')
                .append($('<input>').addClass('input-lg').attr({'type': 'text'}))
                .append($('<button>').addClass('btn add-btn').attr({
                    'type': 'button',
                    'disabled': true
                }).text('Add tag!')));
        //add start list tag elements to widget
        this.tags.forEach((function (elem) {
            this.addTag(elem);
        }).bind(this));
    };

    //create handlers for widget
    TagCloud.prototype.setListeners = function () {
        var _this = this;
        this.$node.find('.edit-read-btn').on('click', function () {
            if (_this.edit === true) {
                //turn on reading mode
                $(this).text('Click and edit!');
                _this.$node.find('.btn-danger').hide();
                _this.$node.find('.add-btn').attr({'disabled': true});
                _this.$node.find('.close-button').hide();
                _this.$node.find('input').off('keyup');
                _this.edit = false;
            } else {
                //turn on editing mode
                $(this).text('Click and read!');
                _this.$node.find('.btn-danger').show();
                _this.$node.find('.add-btn').attr({'disabled': false});
                _this.$node.find('.close-button').show();
                _this.$node.find('input').on('keyup', function (event) {
                    if (event.keyCode === ENTER_CODE) {
                        _this.addFromInputTag();
                    }
                });
                _this.edit = true;
            }
        });

        //set handler for close button of element
        this.$node.find('.btn-danger').on('click', (function () {
            this.$node.find('li').remove();
	    this.tags = [];
        }).bind(this));

        //set handler for adding new tags to widget
        this.$node.find('.add-btn').on('click', this.addFromInputTag.bind(this));
    };

    //function for adding new tags to widget from input
    TagCloud.prototype.addFromInputTag = function () {
        var inp = this.$node.find('input');
        this.input = inp.val().trim();
        if (this.input !== '' && this.tags.indexOf(this.input) === -1) {
            this.addTag(this.input);
            this.tags.push(this.input);
        }
    };

    //function for adding new tags to widget
    TagCloud.prototype.addTag = function (tag) {
        var _this = this;
        var newTag = $('<li>')
            .addClass('tag-cloud')
            .append($('<span>').text(tag))
            .append($('<span class="close-button">').text(' | ×'))
            .appendTo(this.$node.find('.tag-cloud-list'));

        //set handler for removing new element
        newTag.find('.close-button').on('click', function () {
            $(this).parent().remove();
            _this.tags.splice(_this.tags.indexOf(tag), 1);
        });

        if (this.edit) {
            newTag.find('.close-button').show();
        } else {
            newTag.find('.close-button').hide();
        }

        this.$node.find('input').val('');
    };

    //create unique list of elements
    function getUnique(list) {
        list = Array.prototype.slice.call(list);
        return list.filter(function (elem, i, list) {
            return list.indexOf(elem) === i;
        });
    }

    var tag1 = new TagCloud($('#cloud1'), 'aaa', 'ccc', 'bbb');
    var tag2 = new TagCloud($('#cloud2'), 'ddd', 'eee');
});