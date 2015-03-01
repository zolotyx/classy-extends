(function() {
  var app;

  app = angular.module('classyExtendsTest', ['classy', 'classy-extends']);

  app.factory('TestService', function() {
    return function() {
      return 'Test';
    };
  });

  app.classy.controller({
    name: 'ParentController',
    inject: ['$scope', 'TestService'],
    init: function() {
      this.logs = [];
    },
    methods: {
      baseFunc: function() {
        this.logs.push('This only exists on the parent');
      },
      someFunc: function() {
        this.logs.push('Parent');
      }
    }
  });

  app.classy.controller({
    name: 'ChildController',
    "extends": 'ParentController',
    init: function() {
      this._super(arguments);
    },
    methods: {
      someFunc: function() {
        this._super(arguments);
        this.logs.push('Child');
      },
      getServiceText: function() {
        return this.TestService();
      }
    }
  });

  describe('Classy extends (classy-extends.coffee)', function() {
    var childController, scope;
    beforeEach(module('classyExtendsTest'));
    childController = null;
    scope = null;
    beforeEach(function() {
      inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        childController = $controller('ChildController', {
          $scope: scope
        });
      });
    });
    it('should call the base class function if the function does not exist on the child class', function() {
      scope.baseFunc();
      expect(childController.logs).toEqual(['This only exists on the parent']);
    });
    it('should be able to call the super function', function() {
      scope.someFunc();
      expect(childController.logs).toEqual(['Parent', 'Child']);
    });
    it('should inject base class dependencies correctly', function() {
      expect(scope.getServiceText()).toBe('Test');
    });
  });

}).call(this);
