yelp_search = (search_str, latitude, longitude) => {
    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

    const Http = new XMLHttpRequest();
    url = "https://api.yelp.com/v3/businesses/search?"+"term="+encodeURIComponent(search_str)+"&latitude="+String(latitude)+"&longitude="+String(longitude);
    Http.open("GET", url);
    Http.setRequestHeader('Authorization', 'Bearer ' + 'ngBHhApCaTwA0HfEvloYx0N57iWuE3TW1OkKRZ74PKbfDyZBThUWZHemHJ3LeltzP6NQ1dP3leLIepkqVxIkUX7R5xjNBo4vznjOZuOZVFMbgCWWEyxrZHuNNujUW3Yx');
    Http.send();
    console.log('sent')
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4 && Http.status == 200) {
        response = JSON.parse(Http.responseText)

        var result = []
        for (var i = 0; i < response['businesses'].length; i++) {
          result_json = { 
              "name": response['businesses'][i]['name'],
              "image_url": response['businesses'][i]['image_url'],
              "is_closed": response['businesses'][i]['is_closed'],
              "review_count": response['businesses'][i]['review_count'],
              "categories": response['businesses'][i]['categories'],
              "rating": response['businesses'][i]['rating'],
              "coordinates": response['businesses'][i]['coordinates'],
              "price": response['businesses'][i]['price'],
              "location": response['businesses'][i]['location'],
            }
          result.push(result_json)
        }
        console.log(result)

      }
    }
}

yelp_search("ramen",+34.068930,-118.445127)
