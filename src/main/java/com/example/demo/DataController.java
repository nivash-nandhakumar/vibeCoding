
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import java.util.ArrayList;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private DataRepository dataRepository;
    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(DataController.class);

    @GetMapping("/{username}")
    public List<Data> getData(@PathVariable String username) {
        logger.info("Attempting to retrieve data for username: {}", username);
        List<Data> dataList;

        try{
           dataList = dataRepository.findByUsername(username);

           if (dataList == null || dataList.isEmpty()) {            
              logger.warn("No data found for username: {}", username);
               return new ArrayList<>(); // Return an empty list
           }else {
              return dataList;
           }

        }catch (Exception e){
           logger.error("Error retrieving data for username: {}", username, e);
            return new ArrayList<>();
        }
    }

    @PostMapping
    public Data addData(@RequestBody Data data) {
        return dataRepository.save(data);
    }

    @DeleteMapping("/{id}")
    public void deleteData(@PathVariable Long id) {
        dataRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Data> updateData(@PathVariable Long id, @RequestBody Data dataDetails) {
        Optional<Data> optionalData = dataRepository.findById(id);
        if (optionalData.isPresent()) {
            Data data = optionalData.get();
            data.setContent(dataDetails.getContent());
            final Data updatedData = dataRepository.save(data);
            return ResponseEntity.ok(updatedData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
