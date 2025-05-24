package com.capstone.board_back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="image")
@Table(name="image")
public class ImageEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sequence;
    @JoinColumn(name = "board_number", referencedColumnName = "board_number", nullable = true)
    private int boardNumber;
    private String image;

    public ImageEntity(int boardNumber, String image) {
        this.boardNumber = boardNumber;
        this.image = image;
    }

}

