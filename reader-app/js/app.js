var app = angular.module('ReaderApp', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
  .when('/books',{
    controller: 'BookshelfController',
    templateUrl: 'views/bookshelf.html'
  })
  .when('/books/:bookId',{
    controller: 'BookController',
    templateUrl: 'views/book.html'
  })
  .when('/books/:bookId/chapters/:chapterId',{
    controller: 'ChapterController',
    templateUrl: 'views/chapter.html'
  })
  .otherwise({
    redirectTo: '/books'
  });


});

app.factory('books',['$http', function($http){
  return $http.get('https://s3.amazonaws.com/codecademy-content/courses/ltp4/books-api/books.json')
  	.success(function(data){
    return data;
  })
  	.error(function(err){
    return err;
  });
}]);

app.controller('BookController', ['$scope', '$routeParams', 'books', function($scope, $routeParams, books) {
  // Your code here
  books.success(function(data){
    $scope.book = data[$routeParams.bookId];
  });

  // Using this property to create the URL in line 9 of views/book.html
  $scope.currentBookIndex = parseInt($routeParams.bookId);

}]);

app.controller('BookshelfController', ['$scope', 'books', function($scope,books) {
	books.success(function(data){
    $scope.myBooks = data;
  });
}]);

app.controller('ChapterController', ['$scope', 'books', '$routeParams', function($scope, books, $routeParams) {
  books.success(function(data) {
    // Your code here
		$scope.book = data[$routeParams.bookId];
    $scope.chapter = $scope.book.chapters[$routeParams.chapterId];


    // If there no more chapters left, go back to the bookshelf view
    if($routeParams.chapterId >= $scope.book.chapters.length - 1) {
      $scope.nextChapterIndex = "#";
    }
    else if($routeParams.chapterId <= 0) {
      $scope.previousChapterIndex = "#";
    }
  });

  // Using these properties to create the URLs in line 1 and line 11 of view/chapter.html
  $scope.currentBookIndex = parseInt($routeParams.bookId);
  $scope.currentChapterIndex = parseInt($routeParams.chapterId);
  $scope.nextChapterIndex = $scope.currentChapterIndex + 1;
  $scope.previousChapterIndex = $scope.currentChapterIndex - 1;
}]);
