package br.com.j1scorpii.ffmda.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WEBRouteController {

    @GetMapping("/")
    public String homePage(Model model) {
        return "index";
    }
    
    
}
