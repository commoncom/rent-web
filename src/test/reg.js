 while not testing_geohashes.empty():
        current_geohash = testing_geohashes.get()
        // 若中心点的hash既没有在inner_geohashes也没有在outer_geohashes中，
        if current_geohash not in inner_geohashes and current_geohash not in outer_geohashes:
            current_polygon = geohash_to_polygon(current_geohash)  // 反解出多边形
            
            condition = envelope.contains(current_polygon) if inner else envelope.intersects(current_polygon)

            if condition:
                if inner:
                    if polygon.contains(current_polygon):
                        inner_geohashes.add(current_geohash)
                    else:
                        outer_geohashes.add(current_geohash)
                else:
                    if polygon.intersects(current_polygon):
                        inner_geohashes.add(current_geohash)
                    else:
                        outer_geohashes.add(current_geohash)
                for neighbor in geohash.neighbors(current_geohash):
                    if neighbor not in inner_geohashes and neighbor not in outer_geohashes:
                        testing_geohashes.put(neighbor)

    return inner_geohashes